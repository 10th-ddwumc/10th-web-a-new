import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";
import { useNavigate } from "react-router-dom";
import LpCard from "../components/LpCard";

const LpSkeleton = () => (
  <div className="aspect-square bg-zinc-700 animate-pulse" />
);

const LpListPage = () => {

    const navigate = useNavigate();

    const handleCardClick = (id: number) => {
        navigate(`/lp/${id}`);
    };
        
    const [sort, setSort] = useState<"desc" | "asc">("desc");

    const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError, 
    error, 
    refetch 
    } = useInfiniteQuery({
    queryKey: ["lps", sort],
    queryFn: ({ pageParam = 1 }) => 
        getLpList({ 
        page: pageParam as number, 
        take: 40, 
        order: sort 
        }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.data;
        return page < totalPages ? page + 1 : undefined;
    },
    });

    const observerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
        (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
        }
        },
        { threshold: 0.5 }
    );

    const currentElement = observerRef.current;
    if (currentElement) {
        observer.observe(currentElement);
    }

    return () => {
        if (currentElement) {
        observer.unobserve(currentElement);
        }
    };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const lps = data?.pages.flatMap((page) => page.data.data) || [];

    if (isLoading) return <div className="p-10 text-center animate-pulse">데이터 로딩 중...</div>;
    if (isError) return (
        <div className="p-10 text-center">
        <p className="text-red-500 mb-2">Error{error.message}</p>
        <button onClick={() => refetch()} className="bg-[#FF2D86] px-4 py-2 rounded">재시도</button>
        </div>
    );

    return (
    <div className="p-6 bg-black min-h-full">
        <div className="flex justify-end gap-2 mb-6">
        <button 
            onClick={() => setSort("desc")}
            className={`px-4 py-1.5 rounded ${sort === "desc" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
        >
            최신순
        </button>
        <button 
            onClick={() => setSort("asc")}
            className={`px-4 py-1.5 rounded ${sort === "asc" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
        >
            오래된순
        </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
        {isLoading &&
            Array.from({ length: 10 }).map((_, i) => <LpSkeleton key={`loading-${i}`} />)}
        
        //lp카드 컴포넌트로 분리
        {lps.map((lp) => (
            <LpCard 
            key={lp.id} 
            lp={lp} 
            onClick={handleCardClick} 
            />
        ))} 
        {Array.from({ length: 10 }).map((_, i) => <LpSkeleton key={`skeleton-${i}`} />)}
        </div>

        <div ref={observerRef} className="h-40 flex items-center justify-center text-white">
        {!isLoading && !hasNextPage && (
            <span className="text-gray-500 text-sm">모든 LP를 다 불러왔습니다.</span>
        )}
        </div>

        <button className="fixed bottom-10 right-10 w-12 h-12 bg-[#FF2D86] rounded-full flex items-center justify-center text-white text-3xl shadow-lg z-50">
        +
        </button>
    </div>
    );
};

export default LpListPage;