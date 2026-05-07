import type {
  ResponseLpDto,
  ResponseLpsDto,
  ResponseCommentsDto,
} from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export type SortOrder = "latest" | "oldest";

export const getLps = async ({
  sort,
  cursor,
}: {
  sort: SortOrder;
  cursor: number;
}): Promise<ResponseLpsDto> => {
  const order = sort === "latest" ? "desc" : "asc";
  const { data } = await axiosInstance.get(
    `/v1/lps?order=${order}&cursor=${cursor}&limit=12`,
  );
  return data;
};

export const getLpById = async (lpId: number): Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);
  return data;
};

export const postLike = async (lpId: number) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLike = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);
  return data;
};

export const deleteLp = async (lpId: number) => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}`);
  return data;
};

// ─── 댓글 API ──────────────────────────────────────────────────
export const getComments = async ({
  lpId,
  order,
  cursor,
}: {
  lpId: number;
  order: SortOrder;
  cursor: number;
}): Promise<ResponseCommentsDto> => {
  const orderParam = order === "latest" ? "desc" : "asc";
  const { data } = await axiosInstance.get(
    `/v1/lps/${lpId}/comments?order=${orderParam}&cursor=${cursor}&limit=10`,
  );
  return data;
};

export const postComment = async ({
  lpId,
  content,
}: {
  lpId: number;
  content: string;
}) => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, {
    content,
  });
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
