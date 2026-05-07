import type { RequestSigninDto } from "../types/auth";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
  login: (signInData: RequestSigninDto) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessToken,
    setItem: setAccessToken,
    removeItem: removeAccessToken,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const {
    getItem: getRefreshToken,
    setItem: setRefreshToken,
    removeItem: removeRefreshToken,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
  const {
    getItem: getUserName,
    setItem: setUserNameStorage,
    removeItem: removeUserName,
  } = useLocalStorage("userName");

  const [accessToken, setAccessTokenState] = useState<string | null>(
    getAccessToken(),
  );
  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    getRefreshToken(),
  );
  const [userName, setUserNameState] = useState<string | null>(getUserName());

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      const { data } = response;

      if (data && data.accessToken) {
        setAccessTokenState(data.accessToken);
        if (data.refreshToken) setRefreshTokenState(data.refreshToken);
        setUserNameState(data.name ?? null);

        setAccessToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        if (data.name) setUserNameStorage(data.name);

        return true;
      }
      return false;
    } catch (error) {
      console.error("로그인 에러:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      removeAccessToken();
      removeRefreshToken();
      removeUserName();
      setAccessTokenState(null);
      setRefreshTokenState(null);
      setUserNameState(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, userName, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다.");
  return context;
};
