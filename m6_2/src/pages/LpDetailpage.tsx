import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getLpDetail, getLpComments } from "../apis/lp"; 
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";


const CommentSkeleton = () => (
<div className="flex gap-4 mb-6 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-zinc-800" />
    <div className="flex-1">
    <div className="h-4 bg-zinc-800 w-24 mb-2 rounded" />
    <div className="h-3 bg-zinc-800 w-full rounded" />
    </div>
</div>
);


    const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [order, setOrder] = useState<"desc" | "asc">("desc");
    const observerRef = useRef<HTMLDivElement>(null);

    const { data: response, isLoading: isDetailLoading } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid as string),
        enabled: !!lpid,
    });

    const {
        data: commentData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isCommentLoading,
    } = useInfiniteQuery({
        queryKey: ["lpComments", lpid, order], 
        queryFn: ({ pageParam = 1 }) =>
        getLpComments({ lpid: lpid as string, page: pageParam as number, order }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.data;
        return page < totalPages ? page + 1 : undefined;
        },
        enabled: !!lpid,
    });

    const comments = commentData?.pages.flatMap((page) => page.data.data) || [];
    const [showSkeleton, setShowSkeleton] = useState(false);
    useEffect(() => {
    if (isFetchingNextPage) {
        setShowSkeleton(true);
    } else {
        const timer = setTimeout(() => setShowSkeleton(false), 500); // 0.5초 유지
        return () => clearTimeout(timer);
    }
    }, [isFetchingNextPage]);

    useEffect(() => {
        if (!isLoggedIn) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const lp = response?.data;

    if (isDetailLoading) return <div className="p-20 text-center text-white">로딩 중...</div>;
    if (!lp) return <div className="p-20 text-center text-white">데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 text-white">
        <button onClick={() => navigate(-1)} className="mb-6 text-gray-400">← 뒤로가기</button>
        <div className="flex flex-col md:flex-row gap-10 mb-12">
            <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-white/5">
            <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 py-4">
            <h1 className="text-4xl font-black mb-4">{lp.title}</h1>
            <div className="flex items-center gap-2 text-gray-300">
                <span>{lp.user?.nickname || "익명"}</span>
                <span className="text-gray-600">|</span>
                <span>{lp.createdAt?.split("T")[0]}</span>
            </div>
            <button className="mt-8 bg-pink-600 px-6 py-2.5 rounded-full font-bold">❤️ {lp.likesCount || 0}</button>
            </div>
        </div>

        <div className="border-t border-white/10 pt-10">
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-500">댓글 {comments.length}</h2>
            <div className="flex gap-2">
                <button onClick={() => setOrder("desc")} className={`text-sm ${order === "desc" ? "text-white" : "text-gray-500"}`}>최신순</button>
                <button onClick={() => setOrder("asc")} className={`text-sm ${order === "asc" ? "text-white" : "text-gray-500"}`}>오래된순</button>
            </div>
            </div>

            <div className="mb-10 bg-white/5 p-4 rounded-xl border border-white/10">
            <textarea 
                placeholder="댓글을 입력해 주세요 (최대 200자)" 
                className="w-full bg-transparent outline-none resize-none h-24 text-gray-200"
            />
            <div className="flex justify-between items-center mt-2 border-t border-white/10 pt-3">
                <button className="bg-pink-600 px-5 py-1.5 rounded-lg font-bold text-sm hover:bg-pink-700 transition">등록</button>
            </div>
            </div>

            <div className="space-y-6">
            {isCommentLoading
                ? Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)
                : comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-400 flex-shrink-0">
                        USER
                    </div>
                    
                    <div className="flex-1 border-b border-white/5 pb-8 group-last:border-none">
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm text-zinc-200">{comment.user?.nickname || "익명"}</span>
                            <span className="text-[11px] text-zinc-600">{comment.createdAt.split('T')[0]}</span>
                        </div>
                        <button className="text-zinc-600 hover:text-white">⋮</button>
                        </div>
                        <p className="text-zinc-400 text-[14px] leading-relaxed font-light">
                        {comment.content}
                        </p>
                    </div>
                    </div>
                ))
            }
            {Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)} //로딩중 
            {isFetchingNextPage && Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)}
            
            <div ref={observerRef} className="h-10" />
            
            {!hasNextPage && comments.length > 0 && (
                <div className="text-center text-gray-600 text-sm py-10">마지막 댓글입니다.</div>
            )}
            </div>
        </div>
        </div>
    );
};

export default LpDetailPage;