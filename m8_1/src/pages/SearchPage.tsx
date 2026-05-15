import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const [searchMode, setSearchMode] = useState<"title" | "tag">("title");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedQuery = useDebounce(searchInput, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["search", debouncedQuery, order, searchMode],
    queryFn: async ({ pageParam = "" }) => {
      const response = await axiosInstance.get("v1/lps", {
        params: {
          search: debouncedQuery,
          cursor: pageParam,
          order: order,
          type: searchMode,
        },
      });
      return response.data;
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor || undefined,
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, 
  });

  return (
    <div className="p-6 md:p-10 bg-black min-h-screen text-white font-sans">
      <div className="max-w-4xl mx-auto mb-10">
        <div className="relative flex items-center mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={searchMode === "title" ? "제목으로 검색" : "태그로 검색"}
            className="w-full bg-zinc-900 border border-white/10 rounded-full py-4 pl-12 pr-32 text-white outline-none focus:ring-2 focus:ring-[#FF2D86] transition-all"
          />
          
          <div className="absolute right-2">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-zinc-800 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-700"
            >
              {searchMode === "title" ? "제목" : "태그"}
              <svg className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 w-28 bg-zinc-800 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
                <button onClick={() => { setSearchMode("title"); setIsDropdownOpen(false); }} className="w-full px-4 py-2 text-sm hover:bg-[#FF2D86] text-left transition-colors">제목</button>
                <button onClick={() => { setSearchMode("tag"); setIsDropdownOpen(false); }} className="w-full px-4 py-2 text-sm hover:bg-[#FF2D86] text-left transition-colors">태그</button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={() => setOrder("asc")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${order === "asc" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>오래된순</button>
          <button onClick={() => setOrder("desc")} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${order === "desc" ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>최신순</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {status === "pending" && debouncedQuery && <div className="col-span-full text-center py-20 text-zinc-500">검색 중...</div>}
        
        {data?.pages.map((page) =>
          page.data?.data?.map((item: any) => (
            <div key={item.id} className="aspect-square bg-zinc-900 border border-white/5 rounded-xl flex flex-col items-center justify-center p-4 hover:scale-[1.03] transition-transform shadow-lg group">
               <div className="w-full aspect-square mb-3 overflow-hidden rounded-md bg-zinc-800">
                 <img 
                   src={item.thumbnail || "/pochacco.png"} 
                   alt={item.title} 
                   className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" 
                 />
               </div>
               <p className="text-white text-xs font-medium truncate w-full text-center px-1">
                 {item.title}
               </p>
            </div>
          ))
        )}

        {status === "success" && data?.pages[0]?.data?.data?.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500 font-medium">검색 결과가 없습니다.</div>
        )}
      </div>

      <div className="flex justify-center mt-16 mb-24">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 bg-zinc-900 border border-white/10 rounded-full text-sm font-bold text-zinc-400 hover:text-white hover:border-[#FF2D86] transition-all disabled:opacity-50"
          >
            {isFetchingNextPage ? "로딩 중..." : "결과 더 보기"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchPage;