import { useContext, useState, createContext, type PropsWithChildren } from "react";
import type { ResponseSigninDto } from "../types/auth";
import { useLocalstorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../contants/key";
import { postLogout } from "../apis/auth";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    login: (response: ResponseSigninDto) => void;
    logout: () => Promise<void>;
    user: UserInfo | null;
    isLoggedIn: boolean;
}

interface UserInfo {
    id: number;
    name: string;
    nickname?: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvide = ({ children }: PropsWithChildren) => {
    const { setItem: setAT, removeItem: removeAT, getItem: getAT } = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRT, removeItem: removeRT, getItem: getRT } = useLocalstorage(LOCAL_STORAGE_KEY.refreshToken);
    const { setItem: setU, removeItem: removeU, getItem: getU } = useLocalstorage("user_info");
    
    const [accessToken, setAccessToken] = useState<string | null>(getAT());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRT());
    const [user, setUser] = useState<UserInfo | null>(getU());

    const login = (response: ResponseSigninDto) => {
        const { data } = response;
        if (data && data.accessToken) {
            setAT(data.accessToken);
            setRT(data.refreshToken);
            const userInfo = { id: data.id, name: data.name };
            setU(userInfo);

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);
            setUser(userInfo);
        }
    };

    const logout = async () => {
        try {
            await postLogout();
        } finally {
            removeAT();
            removeRT();
            removeU();
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            alert("로그아웃 되었습니다.");
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ 
            accessToken, 
            refreshToken, 
            user, 
            isLoggedIn: !!accessToken, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("cannot found AuthContext");
    return context;
};