import { useEffect, useState } from "react";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeletonList } from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
    const [search, setSearch] = useState("");
    // const { data, isPending, isError } = useGetLpList({
    //     search
    // });
    //console.log(data?.data.data?.map((lp) => lp.id));
    const [order, setOrder] = useState<(typeof PAGINATION_ORDER)[keyof typeof PAGINATION_ORDER]>(PAGINATION_ORDER.desc);

    const { data: lps, isFetching, hasNextPage, isPending, fetchNextPage, isError, refetch } = useGetInfiniteLpList(10, search, order);
    //ref, inView
    //ref -> 특정한 HTML 요소를 감시할 수 있다
    //inView -> 그 요소가 화면에 보이면 true, 보이지 않으면 false
    const { ref, inView } = useInView({
        threshold: 0,
    })

    //console.log(inView);

    useEffect(() => {
        if (inView && !isFetching && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]);


    if (isError) {
        return (
            <div className="mt-20 text-center flex flex-col items-center gap-4">
                <p className="text-white">데이터를 불러오지 못했습니다.</p>
                <button onClick={() => refetch()} className="px-4 py-2 bg-pink-500 text-white rounded-md">재시도</button>
            </div>
        );
    }

    // console.log(lps?.pages.map((page) => console.log(page))); //배열안에 배열 구조로 볼 수 있음
    // [[1,2],[3,4]].flat() -> [1,2,3,4]

    return (
        <div className="container mx-auto px-4 py-8 pt-20">
            {/* 정렬 버튼 */}
            <div className="flex justify-end mb-6 gap-2">
                <div className="bg-white rounded-md p-1 flex">
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.asc)}
                        className={`px-4 py-1 rounded ${order === PAGINATION_ORDER.asc ? "bg-black text-white" : "text-black"}`}
                    >
                        오래된순
                    </button>
                    <button
                        onClick={() => setOrder(PAGINATION_ORDER.desc)}
                        className={`px-4 py-1 rounded ${order === PAGINATION_ORDER.desc ? "bg-black text-white" : "text-black"}`}
                    >
                        최신순
                    </button>
                </div>
            </div>

            {/* 그리드 요소 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isPending && <LpCardSkeletonList count={10} />}
                {lps?.pages?.map((page) => {
                    // 서버 응답 구조에 따라 데이터를 안전하게 추출합니다.
                    const lpList = page?.data?.data?.data || page?.data?.data || [];
                    return Array.isArray(lpList) ? lpList : [];
                })
                    .flat()
                    .map((lp) => (
                        // lp가 존재하고 id가 있을 때만 카드를 렌더링합니다.[cite: 6]
                        lp && lp.id ? <LpCard key={lp.id} lp={lp} /> : null
                    ))}
                {isFetching && <LpCardSkeletonList count={10} />}
            </div>
            <div ref={ref} className="h-10"></div>
        </div>
    )
}

export default HomePage;

/*
import { useQuery} from"@tanstack/react-query";
import { QUERY_KEY } from " .. /constants/key.ts";
import { getLpList } from " .. /apis/lp.ts";

const HomePage = () => { Show usages new *
const { data : ResponseLpListDto | undefined , isPending : boolean , isError : boolean } = useQuery( options: {
queryKey: [QUERY_KEY.lps],
queryFn: () => getLpList( paginationDto: 0),
});

console.log(data);

return <div>{data.data.data.authorld}[/div>;

export default HomePage; Show usages new *
*/