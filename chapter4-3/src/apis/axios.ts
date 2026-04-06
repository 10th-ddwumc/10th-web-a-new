import axios, { type AxiosInstance } from "axios";
import { useLocalstorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../contants/key";

const { getItem } = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);

export const axiosInstanse:AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    headers: {
    Authorization: `Bearer ${getItem()}`,
    },
});

axiosInstanse.interceptors.request.use((config)=>{
    const {getItem} = useLocalstorage(LOCAL_STORAGE_KEY.accessToken);
    const token = getItem();

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});