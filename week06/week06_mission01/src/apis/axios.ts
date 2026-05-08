import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    if (accessToken) {
      config.headers = config.headers || {};
      const cleanToken = accessToken.replace(/^"(.*)"$/, "$1");
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url === "/v1/auth/refresh") {
        localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = localStorage.getItem(
              LOCAL_STORAGE_KEY.refreshToken,
            );
            const cleanRefresh = refreshToken?.replace(/^"(.*)"$/, "$1");
            const { data } = await axios.post(
              `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
              { refresh: cleanRefresh },
            );
            const newAccess = data.data.accessToken;
            const newRefresh = data.data.refreshToken;
            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccess);
            localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefresh);
            return newAccess;
          } catch (refreshError) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
            window.location.href = "/login";
            throw refreshError;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise.then((newAccessToken) => {
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    return Promise.reject(error);
  },
);
