import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";

// 인터셉터에서 사용할 커스텀 타입 정의
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; //요청 재시도 여부를 나타내는 플래그
}

//전역 변수로 refresh 요청의 Promise를 저장해서 중복 요청을
let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    //headers: {
    //  Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
    //},
});

//요청 인터셉터 : 모든 요청 전에 accessToken을 Authorization 헤더에 자동으로 추가
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

    //accessToken이 존재하면 Authorization 헤더에 Bearer 토큰으로 추가
    if (accessToken) {
        config.headers = config.headers || {};
        const cleanToken = accessToken.replace(/^"(.*)"$/, "$1");
        config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    //수정된 요청 설정을 반환합니다.
    return config;
},
    // 요청 인터셉터가 실패하면 에러 뿜음
    (error) => Promise.reject(error),
);

//응답 인터셉터 : 401에러 발생 -> refresh 토큰으로 accessToken 재발급 -> 원래 요청 재시도(토큰 갱신을 처리함)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        //401에러면서, 아직 재시도 하지않은 요청 경우 처리
        //다른 특수 케이스가 잇다면 계속 엮어줘야함 if문안에
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            // refresh 엔트포인트 401에러가 발생한 경우(Unauthorized), 중복 재시도 방지를 위해 로그아웃 처리
            if (originalRequest.url === "/v1/auth/refresh") {
                const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

                removeAccessToken();
                removeRefreshToken();

                window.location.href = "/login";
                return Promise.reject(error);
            }

            //재시도 플래그 설정
            originalRequest._retry = true;

            //이미 리프레시 요청이 진행중이면, 그 Promise를 재사용합니다
            if (!refreshPromise) {
                //refresh 요청 실행 후 프라미스를 전역 변수에 할당
                refreshPromise = (async () => {
                    const { getItem: getRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = getRefreshToken();

                    const { data } = await axiosInstance.post("/v1/auth/refresh", {
                        refresh: refreshToken,
                    });

                    //새토큰이 반환
                    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
                    setAccessToken(data.data.accessToken);
                    setRefreshToken(data.data.refreshToken);

                    //새 accessToken을 반환하여 다른 요청들이 이것을 사용할 수 있게함
                    return data.data.accessToken;

                })().catch((error) => {
                    //refresh 요청 실패 시, 토큰 제거 및 로그인 페이지로 이동
                    const { removeItem: removeAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
                    const { removeItem: removeRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

                    removeAccessToken();
                    removeRefreshToken();

                }).finally(() => {
                    //요청이 끝나면 refreshPromise 초기화
                    refreshPromise = null;
                });

            }
            // 진행중인 refreshPromise가 해결될 때까지 기다림
            return refreshPromise.then((newAccessToken) => {
                //원본 요청의 Authorization 헤더를 갱신된 토큰으로 업데이트
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                //업데이트된 원본 요청을 재시도함
                return axiosInstance(originalRequest);
            });
        }
        //401에러가 아닌경우에 혹은 이미 재시도한 요청인 경우, 에러를 그대로 반환
        return Promise.reject(error);
    },
);