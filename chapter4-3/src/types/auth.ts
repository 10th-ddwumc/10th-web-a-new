import type { CommonResponse } from "./common";

export type RequestSignupDto = {
    name: string;
    email: string;
    bio: string;
    avater: string;
    password: string;
};

export type ResponseSignupDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avater: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;

export type RequestSigninDto = {
    email: string;
    password: string;
};

export type ResponseSigninDto = CommonResponse<{
    id:number;
    name: string;
    accessToken: string;
    refreshToken: string;
}>;

//내정보
export type ResponseMyinfoDto = CommonResponse<{
    id: number;
    name: string;
    email: string;
    bio: string | null;
    avater: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;