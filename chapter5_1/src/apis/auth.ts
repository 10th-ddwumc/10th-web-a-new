import type { 
    RequestSignupDto,
    RequestSigninDto, 
    ResponseSignupDto, 
    ResponseSigninDto,
    ResponseMyinfoDto,
    } from "../types/auth";

import { axiosInstanse } from "./axios";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
    const {data} = await axiosInstanse.post("v1/auth/signup", body);
    return data;
};

export const postSignin = async (body: RequestSigninDto):Promise<ResponseSigninDto> => {
    const {data} = await axiosInstanse.post("v1/auth/signin", body);
    return data;
}; 

export const getMyInfo = async (): Promise<ResponseMyinfoDto> => {
    const {data} = await axiosInstanse.get("v1/users/me");
    return data;
};

export const postLogout = async() => {
    const{data} = await axiosInstanse.post('v1/auth/signout');
    return data;
};