import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

// 댓글 목록 조회를 위한 무한 쿼리 훅
export const useGetLpComments = (lpId: string, order: "asc" | "desc") => {
    return useInfiniteQuery({
        // queryKey에 lpId와 order 포함
        queryKey: ['lpComments', lpId, order],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
                params: { cursor: pageParam, limit: 10, order }
            });
            return data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
        }
    });
};