import { axiosInstance } from "./axios.ts";
import type { CommonResponse, PaginationDto } from "../types/common";
import type { Lp, ResponseLpListDto } from "../types/lp.ts";

/**
 * 다른 사람들이 올린 LP 목록을 불러오는 함수
 * @param paginationDto - page, take, order(정렬) 정보를 담은 객체
 */
export const getLpList = async (
  paginationDto: PaginationDto
): Promise<CommonResponse<ResponseLpListDto>> => {
  const { data } = await axiosInstance.get("v1/lps", {
    // 쿼리 파라미터로 ?page=1&take=20&order=desc 등이 전달됩니다.
    params: paginationDto,
  });
  return data;
};

/**
 * 특정 LP의 상세 정보를 조회를 위한 함수
 * @param id - 해당 LP의 고유 ID
 */
export const getLpDetail = async (id: string): Promise<CommonResponse<Lp>> => {
  const { data } = await axiosInstance.get(`v1/lps/${id}`);
  return data;
};

// 필요한 경우 추가할 수 있는 함수 예시 (LP 등록 등)
// export const postLp = async (body: FormData) => { ... }