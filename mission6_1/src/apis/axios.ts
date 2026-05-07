import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../contants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

// 1. 기본 API 인스턴스
export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 2. 토큰 재발급 전용 순수 인스턴스 (인터셉터 없음)
const refreshInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        const accessToken = stored ? JSON.parse(stored) : null;
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        // [핵심] 리프레시 요청 자체가 401이 나면 즉시 로그아웃 (무한 루프 방지)
        if (originalRequest.url?.includes('/v1/auth/refresh')) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                        // [핵심] refreshInstance 사용
                        const { data } = await refreshInstance.post("/v1/auth/refresh", {
                            refresh: refreshToken,
                        });

                        const newAccessToken = data.data.accessToken;
                        const newRefreshToken = data.data.refreshToken;

                        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
                        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

                        return newAccessToken;
                    } catch (refreshError) {
                        localStorage.clear();
                        window.location.href = "/login";
                        throw refreshError;
                    } finally {
                        refreshPromise = null;
                    }
                })();
            }

            return refreshPromise.then((newAccessToken: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }
        return Promise.reject(error);
    }
);