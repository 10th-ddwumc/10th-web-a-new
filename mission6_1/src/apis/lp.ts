import { axiosInstance } from "./axios.ts";
import type { CommonResponse, PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp.ts";

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
