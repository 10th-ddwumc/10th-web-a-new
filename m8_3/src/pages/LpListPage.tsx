import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";
import { useNavigate } from "react-router-dom";
import LpCard from "../components/LpCard";
import LpAddModal from "./LpAddModal";
import { useThrottle } from "../hooks/useThrottle";

const LpSkeleton = () => (
  <div className="aspect-square bg-zinc-800 animate-pulse rounded-md" />
);

const LpListPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sort, setSort] = useState<"desc" | "asc">("desc");
    const navigate = useNavigate();

    const { 
        data, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading 
    } = useInfiniteQuery({
        queryKey: ["lps", sort],
        queryFn: ({ pageParam }) => 
            getLpList({ 
                cursor: pageParam as number, 
                take: 10, 
                order: sort 
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            const { hasNext, nextCursor } = lastPage.data;
            return hasNext ? nextCursor : undefined;
        },
    });

    const observerRef = useRef<HTMLDivElement>(null);

    const throttledScrollFetch = useThrottle(() => {
        if (hasNextPage && !isFetchingNextPage) {
            const lastPage = data?.pages[data.pages.length - 1];
            if (lastPage) {
                const { hasNext, nextCursor } = lastPage.data;
                console.log("다음 페이지:", hasNext, "다음 커서:", nextCursor);
            }
            fetchNextPage();
        }
    }, 1500);

    useEffect(() => {
        if (!observerRef.current || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    throttledScrollFetch();
                }
            },
            { threshold: 0, rootMargin: '100px' }
        );

        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, throttledScrollFetch]);

    const lps = data?.pages.flatMap((page) => page.data.data) || [];

    if (isLoading) return <div className="p-10 text-center text-zinc-500">로딩 중...</div>;

    return (
        <div className="p-6 bg-black min-h-screen">
            <div className="flex justify-end gap-2 mb-6">
                <button 
                    onClick={() => setSort("desc")}
                    className={`px-4 py-1.5 rounded text-sm font-bold ${sort === "desc" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"}`}
                >
                    최신순
                </button>
                <button 
                    onClick={() => setSort("asc")}
                    className={`px-4 py-1.5 rounded text-sm font-bold ${sort === "asc" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400"}`}
                >
                    오래된순
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1">
                {lps.map((lp) => (
                    <LpCard key={lp.id} lp={lp} onClick={(id) => navigate(`/lp/${id}`)} />
                ))} 
                
                {isFetchingNextPage && 
                    Array.from({ length: 10 }).map((_, i) => <LpSkeleton key={`loading-${i}`} />)
                }
            </div>

            <div ref={observerRef} className="h-20 w-full flex items-center justify-center mt-10">
                {!hasNextPage && lps.length > 0 && (
                    <span className="text-zinc-600 text-sm italic">모든 LP를 다 불러왔습니다.</span>
                )}
            </div>

            <button 
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-10 right-10 w-12 h-12 bg-[#FF2D86] rounded-full flex items-center justify-center text-white text-3xl shadow-lg z-50 transition-all active:scale-95"
            >
                +
            </button>
            <LpAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LpListPage;