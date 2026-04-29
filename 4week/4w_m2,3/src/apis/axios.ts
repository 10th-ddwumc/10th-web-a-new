import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";


export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL || "http://localhost:8080",    // headers: {
    //     Authorization: "Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}",
    // },
});

axiosInstance.interceptors.request.use((config) => {
    // const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    // const token = getItem();
    const token = window.localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const parsedToken = token ? JSON.parse(token) : null;
    if (token) {
        config.headers.Authorization = `Bearer ${parsedToken}`;
    }

    return config;

})