import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";

function useGetInfiniteLpList(
    limit: number,
    search?: string,
    order?: (typeof PAGINATION_ORDER)[keyof typeof PAGINATION_ORDER],
) {
    return useInfiniteQuery({
        queryFn: ({ pageParam }) =>
            getLpList({ cursor: pageParam, limit, search, order }),
        queryKey: [QUERY_KEY.lps, search, order],
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.data.data.hasNext ? lastPage.data.data.nextCursor : undefined;
        }
    })
}

export default useGetInfiniteLpList;