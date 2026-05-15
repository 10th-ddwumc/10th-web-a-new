import { axiosInstance } from "./axios.ts";
import type { CommonResponse, PaginationDto } from "../types/common";
import type { ResponseLpListDto, Lp } from "../types/lp.ts";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<CommonResponse<ResponseLpListDto>> => {
  const { data } = await axiosInstance.get("v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async (id: string): Promise<CommonResponse<Lp>> => {
  const { data } = await axiosInstance.get(`v1/lps/${id}`);
  return data;
};

export const getLpComments = async ({ 
  lpid, 
  page, 
  take = 20, 
  order = "desc" 
}: { 
  lpid: string; 
  page: number; 
  take?: number; 
  order?: "desc" | "asc" 
}) => {
  const { data } = await axiosInstance.get(`v1/lps/${lpid}/comments`, {
    params: {
      page,
      take,
      order,
    },
  });
  return data;
};

export const postLp = async (lpData: {
  title: string;
  content: string;
  thumbnail?: string;
  published: boolean;
  tags: string[];
}) => {
  const { data } = await axiosInstance.post("v1/lps", lpData);
  return data;
};

export const postComment = async (lpid: string, content: string) => {
  const { data } = await axiosInstance.post(`v1/lps/${lpid}/comments`, { content });
  return data;
};

export const deleteComment = async ({ commentId, lpid }: { commentId: number; lpid: string }) => {
    const { data } = await axiosInstance.delete(`v1/lps/${lpid}/comments/${commentId}`); 
    return data;
};

export const patchComment = async ({ 
    lpid, 
    commentId, 
    content 
}: { 
    lpid: string; 
    commentId: number; 
    content: string 
}) => {
    const { data } = await axiosInstance.patch(
        `v1/lps/${lpid}/comments/${commentId}`, 
        { content }
    );
    return data;
};