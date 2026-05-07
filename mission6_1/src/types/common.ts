
export interface CommonResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationDto {
  page: number;
  take: number;
  order: "asc" | "desc";
}