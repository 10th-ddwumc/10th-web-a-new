import type { CommonResponse, CursorBasedResponse } from "./common";

export type Tag = {
    id: number;
    name: string;
};

export type Like = {
    id: number;
    userId: number;
    lpId: number;
};

export type LpAuthor = {
    id: number;
    name: string;
    email?: string;
    avatar?: string | null;
};

export type Lp = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Like[];
    author?: LpAuthor;
};

export type RequestLpDto = {
    lpid: number;
};

export type RequestCreateLpDto = {
    title: string;
    content: string;
    thumbnail: string;
    tags: string[];
    published: boolean;
};

export type RequestUpdateLpDto = Partial<RequestCreateLpDto>;

export type ResponseLpDto = CommonResponse<Lp>;

export type ResponseLpListDto = CursorBasedResponse<Lp[]>;

export type ResponseLikeLpDto = CommonResponse<Like>;