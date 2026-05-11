import type { CommonResponse } from "./common";

export type RequestSigninDto = {
    email: string;
    password: string;
};

export type RequestSignupDto = {
    name: string;
    email: string;
    password: string;
    bio?: string;
    avatar?: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    name?: string;
};

export type User = {
    id: number;
    name: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type RequestUpdateMyInfoDto = {
    name?: string;
    bio?: string;
    avatar?: string;
};

export type ResponseSigninDto = CommonResponse<AuthTokens>;

export type ResponseSignupDto = CommonResponse<User>;

export type ResponseMyInfoDto = CommonResponse<User>;

export type ResponseUpdateMyInfoDto = CommonResponse<User>;