import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { QUERY_KEY } from "../../constants/key";

// 댓글 목록 조회를 위한 무한 쿼리 훅
export const useGetLpComments = (lpId: string, order: "asc" | "desc") => {
    return useInfiniteQuery({
        // queryKey에 공통 QUERY_KEY.comments를 사용해서 invalidateQueries와 연결
        queryKey: [QUERY_KEY.comments, lpId, order],

        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await axiosInstance.get(
                `/v1/lps/${lpId}/comments`,
                {
                    params: {
                        cursor: pageParam,
                        limit: 10,
                        order,
                    },
                },
            );

            return data;
        },

        initialPageParam: 0,

        getNextPageParam: (lastPage) => {
            // 서버 응답 구조가 data.data 또는 data.data.data로 오는 경우를 모두 대비
            const pageData = lastPage?.data?.data ?? lastPage?.data;

            return pageData?.hasNext ? pageData.nextCursor : undefined;
        },

        enabled: !!lpId,

        staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 '신선함' 상태로 유지
        gcTime: 1000 * 60 * 10,
    });
};