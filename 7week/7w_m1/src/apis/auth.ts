import type {
    RequestSigninDto,
    RequestSignupDto,
    RequestUpdateMyInfoDto,
    ResponseMyInfoDto,
    ResponseSigninDto,
    ResponseSignupDto,
    ResponseUpdateMyInfoDto,
} from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup = async (
    body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);

    return data;
};

export const postSignin = async (
    body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);

    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/users/me");

    return data;
};

// 수정: 로그아웃을 useMutation으로 연결하기 위해 API 함수 유지
export const postLogout = async () => {
    const { data } = await axiosInstance.post("/v1/auth/signout");

    return data;
};

//  마이페이지 정보 수정 API 추가
export const patchMyInfo = async (
    body: RequestUpdateMyInfoDto,
): Promise<ResponseUpdateMyInfoDto> => {
    const { data } = await axiosInstance.patch("/v1/users", body);

    return data;
};

//  탈퇴 API 주소도 /v1/users 로 변경
export const deleteMe = async () => {
    const { data } = await axiosInstance.delete("/v1/users");

    return data;
};