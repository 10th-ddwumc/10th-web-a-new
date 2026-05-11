import type { CommonResponse, PaginationDto } from "../types/common";
import { axiosInstance } from "./axios";
import type {
    RequestCreateLpDto,
    RequestLpDto,
    RequestUpdateLpDto,
    ResponseLikeLpDto,
    ResponseLpDto,
    ResponseLpListDto,
} from "../types/lp";

export const getLpList = async (
    paginationDto: PaginationDto,
): Promise<CommonResponse<ResponseLpListDto>> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: paginationDto,
    });

    return data;
};

// 6w_m1 상세 정보 조회를 위한 API 함수
export const getLpDetail = async ({
    lpid,
}: RequestLpDto): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);

    return data;
};

// LP 게시글 생성 API 추가
export const postLp = async (
    body: RequestCreateLpDto,
): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.post("/v1/lps", body);

    return data;
};

// LP 상세 수정 API 추가
export const patchLp = async ({
    lpid,
    body,
}: {
    lpid: number;
    body: RequestUpdateLpDto;
}): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, body);

    return data;
};

//  LP 상세 삭제 API 추가
export const deleteLp = async ({ lpid }: RequestLpDto) => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);

    return data;
};

export const postLike = async ({
    lpid,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

    return data;
};

export const deleteLike = async ({
    lpid,
}: RequestLpDto): Promise<ResponseLikeLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

    return data;
};