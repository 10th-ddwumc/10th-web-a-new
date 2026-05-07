import type { ResponseLpDto, ResponseLpsDto } from "../types/lp.ts";
import { axiosInstance } from "./axios.ts";

export type SortOrder = "latest" | "oldest";

export const getLps = async (sort: SortOrder): Promise<ResponseLpsDto> => {
  const order = sort === "latest" ? "desc" : "asc";
  const { data } = await axiosInstance.get(
    `/v1/lps?order=${order}&cursor=0&limit=20`,
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
