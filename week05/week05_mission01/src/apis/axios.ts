import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  // ✅ 훅(useLocalStorage) 대신 직접 localStorage에서 꺼내옵니다.
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    // 만약 토큰이 "..." 처럼 따옴표를 포함해 저장되어 있다면 제거가 필요할 수 있습니다.
    // 일단은 아래와 같이 기본으로 작성합니다.
    config.headers.Authorization = `Bearer ${token.replace(/^"(.*)"$/, "$1")}`;
  }

  return config;
});
