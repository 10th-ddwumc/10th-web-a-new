import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../apis/lp";
import { useNavigate } from "react-router-dom";

const LpListPage = () => {
    const navigate = useNavigate();

  const handleCardClick = (id: number) => {
    navigate(`/lp/${id}`);
  };
    
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["lps", sort], 
    queryFn: () => getLpList({ 
      page: 1, 
      take: 40, 
      order: sort 
    }),
    staleTime: 1000 * 60 * 5, // 캐시데이터 유지
    gcTime: 1000 * 60 * 10,   // 메모리삭제
  });

  const lps = response?.data.data;

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
        {lps?.map((lp) => (
            <div 
            key={lp.id} 
            onClick={() => handleCardClick(lp.id)}
            className="cursor-pointer aspect-square relative ..."
            >
          <div key={lp.id} className="aspect-square relative group overflow-hidden bg-black">
            <img 
                src={lp.thumbnail} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 z-10">
                <p className="font-bold text-sm text-white line-clamp-2 mb-1">{lp.title}</p>
                <p className="font-normal text-sm text-white line-clamp-2 mb-1">{lp.createdAt.split('T')[0]}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>user {lp.user?.id}</span>
                <div className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{lp.likesCount || 0}</span>
                </div>
                </div>
            </div>
            </div>
            </div>
        ))}
      </div>

      <button className="fixed bottom-10 right-10 w-12 h-12 bg-[#FF2D86] rounded-full flex items-center justify-center text-white text-3xl shadow-lg z-50">
        +
      </button>
    </div>
  );
};

export default LpListPage;