import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getLpById,
  postLike,
  deleteLike,
  deleteLp,
  getComments,
  postComment,
  deleteComment,
  type SortOrder,
} from "../apis/lp.ts";
import { useAuth } from "../context/AuthContext.tsx";
import type { Comment } from "../types/lp.ts";

// ─── 댓글 Skeleton ──────────────────────────────────────────────
const CommentSkeleton = () => (
  <div className="flex items-start gap-3 py-3">
    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-1.5">
      <div className="h-3 w-24 bg-white/10 animate-pulse rounded" />
      <div className="h-3 w-full bg-white/10 animate-pulse rounded" />
    </div>
  </div>
);

// ─── 댓글 아이템 ────────────────────────────────────────────────
const CommentItem = ({
  comment,
  lpId,
  myUserId,
}: {
  comment: Comment;
  lpId: number;
  myUserId?: number;
}) => {
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteComment({ lpId, commentId: comment.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
      setMenuOpen(false);
    },
  });

  const isOwner = myUserId === comment.author.id;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 relative">
      {/* 아바타 */}
      <div className="w-8 h-8 rounded-full bg-[#e11d48]/80 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-full h-full object-cover"
          />
        ) : (
          comment.author.name.charAt(0)
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{comment.author.name}</p>
        <p className="text-sm text-gray-300 mt-0.5 break-words">
          {comment.content}
        </p>
      </div>

      {/* ⋮ 메뉴 (본인 댓글만) */}
      {isOwner && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-white px-1 py-1 transition"
          >
            ⋮
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden z-10 min-w-[80px]">
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition text-left"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── LP 상세 페이지 ─────────────────────────────────────────────
const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const lpId = Number(lpid);
  const [commentText, setCommentText] = useState("");
  const [commentSort, setCommentSort] = useState<SortOrder>("latest");
  const commentBottomRef = useRef<HTMLDivElement>(null);

  // ── LP 상세 데이터 ──────────────────────────────────────────
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["lp", lpId],
    queryFn: () => getLpById(lpId),
    staleTime: 1000 * 60 * 5,
    enabled: !!lpId,
  });
  const lp = data?.data;

  // ── 댓글 useInfiniteQuery ──────────────────────────────────
  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, commentSort],
    queryFn: ({ pageParam }) =>
      getComments({ lpId, order: commentSort, cursor: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data?.hasNextPage ? lastPage.data?.nextCursor : undefined,
    enabled: !!lpId,
  });

  const allComments: Comment[] =
    commentsData?.pages.flatMap((p) => p.data?.data ?? []) ?? [];

  // ── 댓글 스크롤 감지 ──────────────────────────────────────
  useEffect(() => {
    const el = commentBottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextComments &&
          !isFetchingNextComments
        ) {
          fetchNextComments();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextComments, isFetchingNextComments, fetchNextComments]);

  // ── LP 좋아요 ──────────────────────────────────────────────
  const likeMutation = useMutation({
    mutationFn: () => postLike(lpId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lp", lpId] }),
  });

  const unlikeMutation = useMutation({
    mutationFn: () => deleteLike(lpId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lp", lpId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/lps");
    },
  });

  // ── 댓글 작성 ──────────────────────────────────────────────
  const commentMutation = useMutation({
    mutationFn: () => postComment({ lpId, content: commentText }),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) deleteMutation.mutate();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return "방금 전";
  };

  // ── 로딩 ──────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-[#e11d48] rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-4">
        <p className="text-gray-400">LP를 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-[#e11d48] text-white rounded-full text-sm"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 작성자 + 날짜 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center text-xs">
            {lp.author.avatar ? (
              <img
                src={lp.author.avatar}
                alt={lp.author.name}
                className="w-full h-full object-cover"
              />
            ) : (
              lp.author.name.charAt(0)
            )}
          </div>
          <span className="text-sm font-medium">{lp.author.name}</span>
        </div>
        <span className="text-xs text-gray-500">{timeAgo(lp.createdAt)}</span>
      </div>

      {/* 제목 + 수정/삭제 */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">{lp.title}</h1>
        {accessToken && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/lp/${lpId}/edit`)}
              className="text-gray-400 hover:text-white transition"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 transition"
              disabled={deleteMutation.isPending}
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 썸네일 LP판 */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64">
          <div className="w-full h-full rounded-full overflow-hidden border-[10px] border-[#1a1a1a] shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover animate-[spin_8s_linear_infinite]"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-[#111] rounded-full border-2 border-white/10" />
          </div>
        </div>
      </div>

      {/* 본문 */}
      <p className="text-sm text-gray-300 leading-relaxed mb-5">{lp.content}</p>

      {/* 태그 */}
      {lp.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {lp.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
            >
              # {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* 좋아요 */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending || unlikeMutation.isPending}
          className="flex items-center gap-2 px-6 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 transition"
        >
          <span className="text-pink-400 text-lg">♥</span>
          <span className="text-white font-semibold">{lp.likes.length}</span>
        </button>
      </div>

      {/* ─── 댓글 섹션 ──────────────────────────────────────── */}
      <div className="border-t border-white/10 pt-6">
        {/* 댓글 헤더 + 정렬 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">댓글</h2>
          <div className="flex gap-1">
            <button
              onClick={() => setCommentSort("oldest")}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                commentSort === "oldest"
                  ? "bg-white text-black border-white font-semibold"
                  : "border-white/20 text-gray-400 hover:border-white/50"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setCommentSort("latest")}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                commentSort === "latest"
                  ? "bg-white text-black border-white font-semibold"
                  : "border-white/20 text-gray-400 hover:border-white/50"
              }`}
            >
              최신순
            </button>
          </div>
        </div>

        {/* 댓글 입력창 */}
        {accessToken && (
          <div className="flex gap-2 mb-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && commentText.trim()) {
                  commentMutation.mutate();
                }
              }}
              placeholder="댓글을 입력해주세요"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e11d48] transition"
            />
            <button
              onClick={() => commentMutation.mutate()}
              disabled={!commentText.trim() || commentMutation.isPending}
              className="px-4 py-2 bg-[#e11d48] text-white text-sm rounded-lg hover:bg-[#be123c] disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              작성
            </button>
          </div>
        )}

        {/* 초기 로딩: Skeleton 상단 표시 */}
        {isCommentsPending && (
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        )}

        {/* 댓글 목록 */}
        {!isCommentsPending && (
          <>
            {allComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                lpId={lpId}
                myUserId={undefined} // 실제 구현 시 useAuth에서 userId 가져와야 함
              />
            ))}

            {/* 추가 로딩: Skeleton 하단 표시 */}
            {isFetchingNextComments && (
              <div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <CommentSkeleton key={`csk-${i}`} />
                ))}
              </div>
            )}

            {/* 스크롤 감지 트리거 */}
            <div ref={commentBottomRef} className="h-4" />
          </>
        )}
      </div>

      {/* 우측 하단 + 버튼 */}
      <button
        onClick={() => navigate("/lps/new")}
        className="fixed bottom-8 right-6 w-12 h-12 bg-[#e11d48] rounded-full flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(225,29,72,0.5)] hover:bg-[#be123c] hover:scale-110 transition z-30"
        aria-label="LP 추가"
      >
        +
      </button>
    </div>
  );
};

export default LpDetailPage;
