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

interface AuthStorage {
  accessToken: string | null;
  refreshToken: string | null;
  userName: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAuthStorage,
    setItem: setAuthStorage,
    removeItem: removeAuthStorage,
  } = useLocalStorage<AuthStorage>("auth");

  const storedAuth = getAuthStorage();

  const [accessToken, setAccessTokenState] = useState<string | null>(
    storedAuth?.accessToken ?? null,
  );

  const [refreshToken, setRefreshTokenState] = useState<string | null>(
    storedAuth?.refreshToken ?? null,
  );

  const [userName, setUserNameState] = useState<string | null>(
    storedAuth?.userName ?? null,
  );

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      const { data } = response;

      if (data && data.accessToken) {
        const authData: AuthStorage = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? null,
          userName: data.name ?? null,
        };

        setAccessTokenState(authData.accessToken);
        setRefreshTokenState(authData.refreshToken);
        setUserNameState(authData.userName);

        setAuthStorage(authData);

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
      removeAuthStorage();

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

  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다.");
  }

  return context;
};
