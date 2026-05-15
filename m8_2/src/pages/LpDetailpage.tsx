import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLpDetail, getLpComments, postComment, deleteComment, patchComment } from "../apis/lp"; 
import { axiosInstance } from "../apis/axios";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

const CommentSkeleton = () => (
  <div className="flex gap-4 mb-6 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-zinc-800 shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-zinc-800 w-24 mb-2 rounded" />
      <div className="h-3 bg-zinc-800 w-full rounded" />
    </div>
  </div>
);

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { isLoggedIn, user } = useAuth();
    
    const [order, setOrder] = useState<"desc" | "asc">("desc");
    const [commentInput, setCommentInput] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    
    const [modalConfig, setModalConfig] = useState<{ open: boolean; type: "LP" | "COMMENT" | "EDIT_LP"; id?: number } | null>(null);
    const [editLpData, setEditLpData] = useState({ title: "", content: "" });

    const observerRef = useRef<HTMLDivElement>(null);

    const { data: response, isLoading: isDetailLoading } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(lpid as string),
    enabled: !!lpid,
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,
    });

    const lp = response?.data as any;

    useEffect(() => {
        if (lp) {
            setEditLpData({ title: lp.title, content: lp.content || "" });
        }
    }, [lp]);

    const { mutate: deleteLpMutate } = useMutation({
        mutationFn: () => axiosInstance.delete(`v1/lps/${lpid}`),
        onSuccess: () => {
            alert("삭제되었습니다.");
            navigate("/");
        }
    });

    const { mutate: updateLpMutate } = useMutation({
        mutationFn: (data: { title: string; content: string }) => 
            axiosInstance.patch(`v1/lps/${lpid}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lp", lpid] });
            setModalConfig(null);
            alert("수정되었습니다.");
        },
        onError: () => alert("수정에 실패했습니다.")
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
        staleTime: 1000 * 60 * 1,
        gcTime: 1000 * 60 * 5,
    });

    const { mutate: createComment } = useMutation({
        mutationFn: () => postComment(lpid as string, commentInput),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
            setCommentInput("");
        },
    });

    const { mutate: removeComment } = useMutation({
        mutationFn: (commentId: number) => deleteComment({ commentId, lpid: lpid as string }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
            setModalConfig(null);
        },
        onError: () => alert("삭제에 실패했습니다.")
    });

    const { mutate: updateComment } = useMutation({
        mutationFn: ({ id, content }: { id: number; content: string }) => 
            patchComment({ lpid: lpid as string, commentId: id, content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lpComments", lpid] });
            setEditingId(null);
            setEditContent("");
        },
        onError: () => alert("수정에 실패했습니다.")
    });

    const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
        const currentData: any = queryClient.getQueryData(["lp", lpid]);
        const isLiked = currentData?.data?.isLiked; 

        if (isLiked) {
        return await axiosInstance.delete(`/v1/lps/${lpid}/likes`);
        } else {
        return await axiosInstance.post(`/v1/lps/${lpid}/likes`);
        }
    },
    onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["lp", lpid] });
        const previousLp = queryClient.getQueryData(["lp", lpid]);

        queryClient.setQueryData(["lp", lpid], (old: any) => {
        if (!old) return old;
        const willBeLiked = !old.data.isLiked;
        
        return {
            ...old,
            data: {
            ...old.data,
            likesCount: willBeLiked 
                ? (old.data.likesCount || 0) + 1 
                : Math.max(0, (old.data.likesCount || 0) - 1),
            isLiked: willBeLiked 
            }
        };
        });
        return { previousLp };
    },
    });

    const comments = commentData?.pages.flatMap((page) => page.data.data) || [];
    
    useEffect(() => {
        if (!isLoggedIn) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchNextPage(); },
            { threshold: 1.0 }
        );
        observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isDetailLoading) return <div className="p-20 text-center text-white">로딩 중...</div>;
    if (!lp) return <div className="p-20 text-center text-white">데이터를 찾을 수 없습니다.</div>;

    const handleConfirmAction = () => {
        if (!modalConfig) return;
        if (modalConfig.type === "LP") deleteLpMutate();
        else if (modalConfig.type === "COMMENT" && modalConfig.id) removeComment(modalConfig.id);
        else if (modalConfig.type === "EDIT_LP") updateLpMutate(editLpData);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 text-white">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">← 뒤로가기</button>
                {user && lp && (user.name === lp.author?.name) && (
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setModalConfig({ open: true, type: "EDIT_LP" })}
                            className="text-sm text-zinc-400 hover:text-white"
                        >
                            수정
                        </button>
                        <button 
                            onClick={() => setModalConfig({ open: true, type: "LP" })}
                            className="text-sm text-zinc-400 hover:text-red-500"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-10 mb-12">
                <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5">
                    <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 py-4 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-black mb-4 leading-tight">{lp.title}</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span className="text-pink-500 font-bold">{lp.authorId?.name || "익명"}</span>
                            <span>|</span>
                            <span>{lp.createdAt?.split("T")[0]}</span>
                        </div>
                        <p className="mt-6 text-zinc-400 font-light leading-relaxed whitespace-pre-wrap">{lp.content || "등록된 설명이 없습니다."}</p>
                    </div>
                    <button 
                    onClick={() => toggleLike()}
                    className={`mt-8 self-start px-8 py-3 rounded-full font-bold transition-all ${
                        lp?.isLiked ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                    }`}
                    >
                    {lp?.isLiked ? "❤️" : "🤍"} {lp?.likesCount || 0}
                    </button>
                </div>
            </div>

            <div className="border-t border-white/10 pt-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-pink-500">댓글 {comments.length}</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setOrder("desc")} className={`text-sm font-bold ${order === "desc" ? "text-white" : "text-gray-500"}`}>최신순</button>
                        <button onClick={() => setOrder("asc")} className={`text-sm font-bold ${order === "asc" ? "text-white" : "text-gray-500"}`}>오래된순</button>
                    </div>
                </div>

                <div className="mb-10 bg-white/5 p-5 rounded-2xl border border-white/5">
                    <textarea 
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="음악에 대한 생각을 나누어보세요" 
                        className="w-full bg-transparent outline-none resize-none h-24 text-gray-200 placeholder:text-zinc-600"
                    />
                    <div className="flex justify-end mt-2">
                        <button 
                            onClick={() => createComment()}
                            disabled={!commentInput.trim()}
                            className="bg-pink-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-pink-700 disabled:opacity-50 transition-all"
                        >
                            등록
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {isCommentLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)
                    ) : (
                        <>
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 border border-white/5">USER</div>
                                    <div className="flex-1 border-b border-white/5 pb-8 group-last:border-none">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-sm text-zinc-200">{comment.author?.name || "익명"}</span>
                                                <span className="text-[11px] text-zinc-600">{comment.createdAt.split('T')[0]}</span>
                                            </div>
                                            {user && (user.name === comment.author?.name) && (
                                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }} 
                                                        className="text-xs text-zinc-500 hover:text-white"
                                                    >
                                                        수정
                                                    </button>
                                                    <button 
                                                        onClick={() => setModalConfig({ open: true, type: "COMMENT", id: comment.id })} 
                                                        className="text-xs text-zinc-500 hover:text-red-500"
                                                    >
                                                        삭제
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {editingId === comment.id ? (
                                            <div className="mt-2 bg-zinc-900 p-4 rounded-xl border border-pink-500/50">
                                                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full bg-transparent text-zinc-200 outline-none resize-none h-20 text-sm" />
                                                <div className="flex justify-end gap-2 mt-3">
                                                    <button onClick={() => updateComment({ id: comment.id, content: editContent })} className="bg-pink-600 px-4 py-1.5 rounded-lg text-xs font-bold">저장</button>
                                                    <button onClick={() => setEditingId(null)} className="bg-zinc-800 px-4 py-1.5 rounded-lg text-xs font-bold">취소</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-zinc-400 text-[15px] leading-relaxed font-light">{comment.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isFetchingNextPage && <CommentSkeleton />}
                            <div ref={observerRef} className="h-10" />
                        </>
                    )}
                </div>
            </div>

            {modalConfig?.open && (
                <div className="fixed inset-0 flex items-center justify-center z-100">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalConfig(null)} />
                    <div className={`relative bg-zinc-900 p-8 rounded-3xl w-full text-center border border-white/10 shadow-2xl transition-all ${modalConfig.type === "EDIT_LP" ? "max-w-md" : "max-w-sm"}`}>
                        <button onClick={() => setModalConfig(null)} className="absolute top-4 right-6 text-zinc-500 hover:text-white text-xl">✕</button>
                        
                        {modalConfig.type === "EDIT_LP" ? (
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-white mb-6 text-center">LP 수정</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-zinc-500 ml-1">제목</label>
                                        <input 
                                            type="text"
                                            value={editLpData.title}
                                            onChange={(e) => setEditLpData({ ...editLpData, title: e.target.value })}
                                            className="w-full bg-zinc-800 border border-white/5 rounded-xl p-3 mt-1 text-sm focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-zinc-500 ml-1">설명</label>
                                        <textarea 
                                            value={editLpData.content}
                                            onChange={(e) => setEditLpData({ ...editLpData, content: e.target.value })}
                                            className="w-full bg-zinc-800 border border-white/5 rounded-xl p-3 mt-1 text-sm h-32 resize-none focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-lg font-bold text-white mb-8 mt-4">
                                {modalConfig.type === "LP" ? "정말 이 LP를 삭제하시겠습니까?" : "댓글을 정말 삭제하시겠습니까?"}
                            </h2>
                        )}

                        <div className="flex gap-4 mt-8">
                            <button onClick={handleConfirmAction} className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all">
                                {modalConfig.type === "EDIT_LP" ? "수정완료" : "예"}
                            </button>
                            <button onClick={() => setModalConfig(null)} className="flex-1 py-3 bg-pink-600 text-white font-black rounded-xl hover:bg-pink-700 transition-all">아니오</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LpDetailPage;