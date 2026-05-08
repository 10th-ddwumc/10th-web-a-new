import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLpById, postLike, deleteLike, deleteLp } from "../apis/lp.ts";
import { useAuth } from "../context/AuthContext.tsx";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const lpId = Number(lpid);

  // ✅ useQuery: queryKey에 lpid 포함
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["lp", lpId],
    queryFn: () => getLpById(lpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!lpId,
  });

  const lp = data?.data;

  // 현재 유저가 좋아요 눌렀는지 — userId는 토큰 decode 없이 간단히 확인 불가하므로 likes 배열 길이로만 표시
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

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
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

  // ── 로딩 ───────────────────────────────────────────────────────
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

  // ── 에러 ───────────────────────────────────────────────────────
  if (isError || !lp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full gap-4">
        <p className="text-gray-400">LP를 불러오지 못했습니다.</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-[#e11d48] text-white rounded-full text-sm hover:bg-[#be123c] transition"
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

      {/* 제목 + 수정/삭제 버튼 */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">{lp.title}</h1>
        {accessToken && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/lp/${lpId}/edit`)}
              className="text-gray-400 hover:text-white transition"
              aria-label="수정"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-400 transition"
              aria-label="삭제"
              disabled={deleteMutation.isPending}
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 썸네일 (LP판 원형) */}
      <div className="flex justify-center mb-6">
        <div className="relative w-64 h-64">
          <div className="w-full h-full rounded-full overflow-hidden border-[10px] border-[#1a1a1a] shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover animate-[spin_8s_linear_infinite]"
            />
          </div>
          {/* 중앙 원 */}
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

      {/* 좋아요 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending || unlikeMutation.isPending}
          className="flex items-center gap-2 px-6 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 transition"
        >
          <span className="text-pink-400 text-lg">♥</span>
          <span className="text-white font-semibold">{lp.likes.length}</span>
        </button>
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
