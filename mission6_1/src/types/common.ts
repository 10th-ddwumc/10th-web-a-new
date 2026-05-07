// types/common.ts

export interface CommonResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T; // 위에서 정의한 ResponseLpListDto나 Lp가 이 자리에 들어갑니다.
}

export interface PaginationDto {
  page: number;
  take: number;
  order: "asc" | "desc"; // 최신순(desc), 오래된순(asc) 정렬을 위한 타입
}