import { useContext, useState, createContext, type PropsWithChildren } from "react";
import type { RequestSigninDto, RequestSignupDto } from "../types/auth";
import { useLocalstorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../contants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType{
    accessToken: string | null;
    refreshToken: string | null;
    login: (sigininData: RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login:async ()=>{},
    logout:async () => {},
});

export const AuthProvide = ({children}: PropsWithChildren) => {
    const {getItem: getAccessTokenFromStorage,
         setItem:setAccessTokeninStorage,
         removeItem:removeAccessTokenFromStorage
        } = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);
    const {getItem:getRefreshTokenFromStorage, 
         setItem: setRefreshTokeninStorage ,
         removeItem: removeRefreshTokenFromStorage
        } = useLocalstorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string|null>(
        getAccessTokenFromStorage(),
    );    
        
    const [refreshToken, setRefreshToken] = useState<string|null>(
        getRefreshTokenFromStorage(),
    );    
    const login = async(signinData: RequestSigninDto)=> {
       try {const { data }= await postSignin(signinData);

        if(data){
            const newAccessToken: string = data.accessToken;
            const newRefreshToken: string = data.RefreshToken;
            setAccessTokeninStorage(newAccessToken);
            setRefreshTokeninStorage(newRefreshToken);
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            alert("로그인 성공");
            window.location.href = "/my";
        }
    }
        catch(error){
            console.error("error",error);
            alert("로그인 실패");
        }
    };

    const logout = async() => {
        try{
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
                        
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 되었습니다.");
        }
        catch(error){
            console.error("error",error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value={{accessToken,refreshToken,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context: AuthContextType = useContext(AuthContext);
    if(!context){
        throw new Error("cannot found AuthContext");
    }
    return context;
}