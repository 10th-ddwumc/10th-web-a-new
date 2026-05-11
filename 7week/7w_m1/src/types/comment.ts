import type { CommonResponse, CursorBasedResponse } from "./common";

export type CommentAuthor = {
    id: number;
    name: string;
    avatar?: string | null;
};

export type LpComment = {
    id: number;
    content: string;
    lpId: number;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    author?: CommentAuthor;

    // 서버 응답이 authorName, nickname처럼 올 수도 있어서 화면에서 안전하게 처리하기 위한 선택 필드
    authorName?: string;
    nickname?: string;
    userId?: number;
};

export type RequestCreateCommentDto = {
    content: string;
};

export type RequestUpdateCommentDto = {
    content: string;
};

export type ResponseCommentDto = CommonResponse<LpComment>;

export type ResponseCommentListDto = CommonResponse<CursorBasedResponse<LpComment[]>>;