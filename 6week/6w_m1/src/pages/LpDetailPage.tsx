import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { getLpDetail } from "../apis/ip";
import { useGetLpComments } from "../hooks/queries/useGetLpComments";
import { useAuth } from "../context/AuthContext";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";

const LpDetailPage = () => {
    const { lpid } = useParams();
    const { userName } = useAuth();
    const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");

    const [commentInput, setCommentInput] = useState("");
    const [localComments, setLocalComments] = useState<any[]>([]);

    const { data: detailData, isLoading: isDetailLoading } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid!),
        enabled: !!lpid,

        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 10, // 10분
    });

    const {
        data: commentData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isCommentLoading
    } = useGetLpComments(lpid!, commentOrder);

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleAddComment = () => {
        if (!commentInput.trim()) return;

        const newComment = {
            id: Date.now(), // 임시 고유 ID
            authorName: userName || "익명",
            content: commentInput,
            createdAt: new Date().toISOString()
        };

        setLocalComments([newComment, ...localComments]);
        setCommentInput(""); // 입력창 초기화
    };

    if (isDetailLoading) return <div className="pt-32 max-w-2xl mx-auto"><LpCardSkeleton /></div>;

    const lp = detailData?.data;

    return (
        <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-white">

            <div className="bg-[#1E1E1E] rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">댓글</h2>
                    <div className="bg-gray-800 p-1 rounded-md flex gap-1">
                        <button onClick={() => setCommentOrder("asc")} className={`px-3 py-1 text-sm rounded ${commentOrder === "asc" ? "bg-white text-black" : "text-gray-400"}`}>오래된순</button>
                        <button onClick={() => setCommentOrder("desc")} className={`px-3 py-1 text-sm rounded ${commentOrder === "desc" ? "bg-white text-black" : "text-gray-400"}`}>최신순</button>
                    </div>
                </div>

                <div className="flex gap-2 mb-8">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="댓글을 입력해주세요"
                        className="flex-1 bg-transparent border border-gray-700 rounded-md px-4 py-2 outline-none focus:border-pink-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button
                        onClick={handleAddComment}
                        className="bg-gray-700 px-6 py-2 rounded-md hover:bg-pink-500 transition-colors"
                    >
                        작성
                    </button>
                </div>

                <div className="flex flex-col gap-6">
                    {localComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start group">
                            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold">
                                {comment.authorName?.[0]}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-sm">{comment.authorName}</span>
                                    <button className="text-gray-500">⋮</button>
                                </div>
                                <p className="text-gray-300 text-sm">{comment.content}</p>
                            </div>
                        </div>
                    ))}

                    {commentData?.pages.flatMap(page => page.data.data).map((comment: any) => {
                        const displayName = comment.authorName || comment.nickname || "연진김";

                        return (
                            <div key={comment.id} className="flex gap-3 items-start group">
                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                                    {displayName[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-white">{displayName}</span>
                                        <button className="opacity-0 group-hover:opacity-100 text-gray-500">⋮</button>
                                    </div>
                                    <p className="text-gray-300 text-sm">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div ref={ref} className="h-4" />
                {isFetchingNextPage && <div className="text-center py-4 text-sm text-gray-500">댓글 로딩 중...</div>}
            </div>
        </div>
    );
};

export default LpDetailPage;