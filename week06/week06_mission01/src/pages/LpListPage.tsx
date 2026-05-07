import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getLps, type SortOrder } from "../apis/lp.ts";
import type { Lp } from "../types/lp.ts";

// ─── LP 카드 ────────────────────────────────────────────────────
const LpCard = ({ lp }: { lp: Lp }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return "방금 전";
  };

  return (
    <div
      className="relative aspect-square overflow-hidden cursor-pointer rounded-sm"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          hovered ? "scale-110" : "scale-100"
        }`}
      />

      {/* 호버 오버레이 */}
      <div
        className={`absolute inset-0 bg-black/60 flex flex-col justify-end p-3 transition-opacity duration-300 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-white text-sm font-semibold truncate">{lp.title}</p>
        <p className="text-gray-300 text-xs">{timeAgo(lp.createdAt)}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-pink-400 text-xs">♥ {lp.likes.length}</span>
        </div>
      </div>
    </div>
  );
};

// ─── LP 목록 페이지 ─────────────────────────────────────────────
const LpListPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortOrder>("latest");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["lps", sort],
    queryFn: () => getLps(sort),
    staleTime: 1000 * 60 * 5,
  });

  const lps: Lp[] = data?.data?.data ?? [];

  return (
    <div className="relative min-h-full">
      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 p-4">
        <button
          onClick={() => setSort("oldest")}
          className={`px-4 py-1.5 text-sm rounded-full border transition ${
            sort === "oldest"
              ? "bg-white text-black border-white font-semibold"
              : "border-white/20 text-gray-400 hover:border-white/50"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setSort("latest")}
          className={`px-4 py-1.5 text-sm rounded-full border transition ${
            sort === "latest"
              ? "bg-white text-black border-white font-semibold"
              : "border-white/20 text-gray-400 hover:border-white/50"
          }`}
        >
          최신순
        </button>
      </div>

      {/* 로딩 */}
      {isPending && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5 px-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* 에러 */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-gray-400">데이터를 불러오지 못했습니다.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-[#e11d48] text-white rounded-full text-sm hover:bg-[#be123c] transition"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* LP 그리드 */}
      {!isPending && !isError && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-0.5">
          {lps.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        </div>
      )}

      {/* 우측 하단 + 플로팅 버튼 */}
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

export default LpListPage;
