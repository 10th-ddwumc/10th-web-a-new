import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../contants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

const refreshInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        const accessToken = stored ? JSON.parse(stored) : null;
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        if (originalRequest.url?.includes('/v1/auth/refresh')) {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    try {
                        const refreshToken = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                        const { data } = await refreshInstance.post("/v1/auth/refresh", {
                            refresh: refreshToken,
                        });

                        const newAccessToken = data.data.accessToken;
                        const newRefreshToken = data.data.refreshToken;

                        localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, newAccessToken);
                        localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, newRefreshToken);

                        return newAccessToken;
                    } catch (refreshError) {
                        localStorage.clear();
                        window.location.href = "/login";
                        throw refreshError;
                    } finally {
                        refreshPromise = null;
                    }
                })();
            }

            return refreshPromise.then((newAccessToken: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }
        return Promise.reject(error);
    }
);