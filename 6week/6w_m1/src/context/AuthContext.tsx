import { useContext, useState, createContext, type PropsWithChildren, useEffect } from "react";
import type { RequestSigninDto, ResponseMyInfoDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userName: string | null; // 사용자 닉네임 추가
    login: (sigininData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userName: null, // 사용자 닉네임 추가
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { getItem: getAccessTokenFromStorage,
        setItem: setAccessTokeninStorage,
        removeItem: removeAccessTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const { getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokeninStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    const [userName, setUserName] = useState<string | null>(null); // 사용자 닉네임 상태 추가

    useEffect(() => {
        if (accessToken) {
            getMyInfo().then(res => setUserName(res.data.name)).catch(() => logout()); // 사용자 닉네임 설정
        }
    }, [accessToken]);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);

            if (data) {
                setAccessTokeninStorage(data.accessToken);
                setRefreshTokeninStorage(data.refreshToken);

                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);

                setUserName(data.name); // 로그인 성공 시 닉네임 설정

                alert("로그인 성공");
                window.location.href = "/my";
            }
        }
        catch (error) {
            console.error("error", error);
            alert("로그인 실패");
        }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            //localStorage.clear(); // localStorage의 모든 데이터를 제거하는 방법도 있지만, 다른 데이터가 있을 수 있으므로 필요한 키만 제거하는 것이 좋음

            setAccessToken(null);
            setRefreshToken(null);

            setUserName(null);

            alert("로그아웃 되었습니다.");
        }
        catch (error) {
            console.error("로그아웃 에러", error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 커스텀 훅 : useAuth
export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);
    // context가 undefined인 경우는 AuthProvide로 감싸지 않은 컴포넌트에서 useAuth를 사용한 경우이므로, 에러를 발생시킴
    if (!context) {
        throw new Error("cannot found AuthContext");
    }
    return context;
}