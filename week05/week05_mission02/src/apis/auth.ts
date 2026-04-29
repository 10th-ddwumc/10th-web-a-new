import type {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from "../types/auth.ts";
import { axiosInstance } from "./axios.ts";
import axios from "axios";

const handleApiError = (error: unknown, defaultMessage: string): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || defaultMessage;
    throw new Error(message);
  }

  throw new Error(defaultMessage);
};

export const postSignup = async (
  body: RequestSignupDto,
): Promise<ResponseSignupDto> => {
  try {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
  } catch (error) {
    return handleApiError(error, "회원가입에 실패했습니다.");
  }
};

export const postSignin = async (
  body: RequestSigninDto,
): Promise<ResponseSigninDto> => {
  try {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
  } catch (error) {
    return handleApiError(error, "로그인에 실패했습니다.");
  }
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  try {
    const { data } = await axiosInstance.get("/v1/users/me");
    return data;
  } catch (error) {
    return handleApiError(error, "사용자 정보를 불러오는데 실패했습니다.");
  }
};

export const postLogout = async () => {
  try {
    const { data } = await axiosInstance.post("/v1/auth/signout");
    return data;
  } catch (error) {
    return handleApiError(error, "로그아웃에 실패했습니다.");
  }
};
