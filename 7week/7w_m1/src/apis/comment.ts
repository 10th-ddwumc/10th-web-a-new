import { axiosInstance } from "./axios";
import type {
    RequestCreateCommentDto,
    RequestUpdateCommentDto,
    ResponseCommentDto,
} from "../types/comment";

export const postComment = async ({
    lpId,
    body,
}: {
    lpId: number;
    body: RequestCreateCommentDto;
}): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.post(
        `/v1/lps/${lpId}/comments`,
        body,
    );

    return data;
};

export const patchComment = async ({
    lpId,
    commentId,
    body,
}: {
    lpId: number;
    commentId: number;
    body: RequestUpdateCommentDto;
}): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.patch(
        `/v1/lps/${lpId}/comments/${commentId}`,
        body,
    );

    return data;
};

export const deleteComment = async ({
    lpId,
    commentId,
}: {
    lpId: number;
    commentId: number;
}) => {
    const { data } = await axiosInstance.delete(
        `/v1/lps/${lpId}/comments/${commentId}`,
    );

    return data;
};