// src/api.ts
import axios from "axios";

// 1. 인스턴스 생성
export const api = axios.create({
  baseURL: "http://localhost:8000/v1", // 본인의 서버 주소 확인
});

let refreshPromise: Promise<string> | null = null;

// 2. 요청 인터셉터: 토큰 주입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 3. 응답 인터셉터: 리프레시 로직
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

// src/api.ts 의 refreshPromise 내부 로직 수정
// src/api.ts 의 refreshPromise 내부 로직

if (!refreshPromise) {
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // 🚀 백엔드 Strategy 설정(fromBodyField)에 맞춰서 보냅니다.
      const { data } = await axios.post("http://localhost:8000/v1/auth/refresh", {
        refresh: refreshToken, // 👈 'refreshToken'이 아니라 'refresh'여야 합니다!
      });

      console.log("리프레시 성공!", data);

      const newAccess = data.data.accessToken;
      localStorage.setItem("accessToken", newAccess);
      
      return newAccess;
    } catch (e) {
      console.error("리프레시 실패:", e);
      localStorage.clear();
      return Promise.reject(e);
    } finally {
      refreshPromise = null;
    }
  })();
}

      return refreshPromise.then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }
    return Promise.reject(err);
  }
);