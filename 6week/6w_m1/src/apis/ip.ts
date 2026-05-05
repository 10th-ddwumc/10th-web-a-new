import type { CommonResponse, PaginationDto } from "../types/common";
import { axiosInstance } from "./axios.ts";
import type { ResponseLpListDto, Lp } from "../types/lp.ts";


export const getLpList = async (paginationDto: PaginationDto): Promise<CommonResponse<ResponseLpListDto>> => {
    const { data } = await axiosInstance.get("v1/lps", {
        params: paginationDto,
    });
    return data;
};

// 6w_m1 상세 정보 조회를 위한 API 함수
export const getLpDetail = async (id: string): Promise<CommonResponse<Lp>> => {
    const { data } = await axiosInstance.get(`v1/lps/${id}`);
    return data;
};