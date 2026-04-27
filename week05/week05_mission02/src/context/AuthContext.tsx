import type { RequestSigninDto } from "../types/auth";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestSigninDto) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage(),
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage(),
  );

  const login = async (signinData: RequestSigninDto) => {
    try {
      const response = await postSignin(signinData);
      const { data } = response;

      // 서버 응답에 토큰이 있는지 확인
      if (data && data.accessToken) {
        // 상태 업데이트
        setAccessToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);

        // 스토리지 저장 (훅에서 제공하는 setItem 사용)
        setAccessTokenInStorage(data.accessToken);
        if (data.refreshToken) setRefreshTokenInStorage(data.refreshToken);

        return true;
      }
      return false; // 토큰이 없는 경우 false 반환
    } catch (error) {
      console.error("로그인 에러:", error);
      return false; // 에러 발생 시 로그인을 시도한 쪽에서 처리할 수 있도록 false 반환
    }
  };

  const logout = async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 에러:", error);
    } finally {
      // 통신 성공 여부와 상관없이 클라이언트의 인증 정보는 삭제
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
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
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다.");
  }
  return context;
};
