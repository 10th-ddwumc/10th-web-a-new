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
    userName: string | null;

    setAuth: (authData: AuthTokens) => void;
    clearAuth: () => void;
    logout: () => void;

    // 수정: 마이페이지 닉네임 수정 시 Navbar 닉네임도 즉시 바꾸기 위한 함수
    updateUserName: (name: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    userName: null,
    setAuth: () => { },
    clearAuth: () => { },
    logout: () => { },
    updateUserName: () => { },
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

    const [userName, setUserName] = useState<string | null>(null);

    const setAuth = (authData: AuthTokens) => {
        setAccessTokeninStorage(authData.accessToken);
        setRefreshTokeninStorage(authData.refreshToken);

        setAccessToken(authData.accessToken);
        setRefreshToken(authData.refreshToken);

        setUserName(authData.name ?? null);
    };

    const clearAuth = () => {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();

        setAccessToken(null);
        setRefreshToken(null);
        setUserName(null);
    };

    const logout = () => {
        clearAuth();
    };

    // usePatchMyInfo의 onMutate에서 호출하여 Navbar 닉네임을 즉시 변경
    const updateUserName = (name: string | null) => {
        setUserName(name);
    };

    useEffect(() => {
        if (!accessToken) {
            setUserName(null);
            return;
        }

        getMyInfo()
            .then((res) => setUserName(res.data.name))
            .catch(() => clearAuth());
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
                updateUserName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);

    if (!context) {
        throw new Error("cannot found AuthContext");
    }

    return context;
};