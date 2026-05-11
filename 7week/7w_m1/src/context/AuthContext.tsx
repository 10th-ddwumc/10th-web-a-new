import {
    createContext,
    type PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import type { AuthTokens } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { getMyInfo } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userName: string | null; // 사용자 닉네임 추가

    // 로그인 useMutation 성공 시 토큰을 저장하기 위한 함수
    setAuth: (authData: AuthTokens) => void;

    //  로그아웃, 탈퇴 성공 시 토큰과 유저 정보를 제거하기 위한 함수
    clearAuth: () => void;

    //  기존 코드 호환용으로 logout 이름도 유지
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userName: null, // 사용자 닉네임 추가
    setAuth: () => { },
    clearAuth: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokeninStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokeninStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage(),
    );

    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage(),
    );

    const [userName, setUserName] = useState<string | null>(null); // 사용자 닉네임 상태 추가

    //로그인 성공 시 useMutation의 onSuccess에서 호출할 함수
    const setAuth = (authData: AuthTokens) => {
        setAccessTokeninStorage(authData.accessToken);
        setRefreshTokeninStorage(authData.refreshToken);

        setAccessToken(authData.accessToken);
        setRefreshToken(authData.refreshToken);

        setUserName(authData.name ?? null);
    };

    //  로그아웃, 탈퇴 성공 시 공통으로 사용할 함수
    const clearAuth = () => {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();

        setAccessToken(null);
        setRefreshToken(null);
        setUserName(null);
    };

    // 기존 Navbar, MyPage 등에서 logout을 사용하던 코드가 깨지지 않도록 유지
    const logout = () => {
        clearAuth();
    };

    useEffect(() => {
        if (!accessToken) {
            setUserName(null);
            return;
        }

        getMyInfo()
            .then((res) => setUserName(res.data.name))
            .catch(() => clearAuth()); // 사용자 닉네임 설정
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                userName,
                setAuth,
                clearAuth,
                logout,
            }}
        >
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
};