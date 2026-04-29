import { useContext, useState, createContext, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalstorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../contants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvide = ({ children }: PropsWithChildren) => {
    const { getItem: getAT, setItem: setAT, removeItem: removeAT } = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);
    const { getItem: getRT, setItem: setRT, removeItem: removeRT } = useLocalstorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(getAT());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRT());

    const login = async (signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);
console.log("data:", data);
console.log("accessToken:", data?.accessToken);
            if (data && data.accessToken) {
                setAT(data.accessToken);
                setRT(data.refreshToken);
                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);

                alert("로그인 성공");
                window.location.href = "/my";
            }
        } catch (error) {
            console.error("로그인 실패", error);
            alert("로그인 정보가 일치하지 않습니다.");
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        } finally {
            removeAT();
            removeRT();
            setAccessToken(null);
            setRefreshToken(null);
            alert("로그아웃 되었습니다.");
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("cannot found AuthContext");
    return context;
};