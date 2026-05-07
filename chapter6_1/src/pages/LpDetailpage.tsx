import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp"; 
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();
    const handleCardClick = (id: number) => {
        navigate(`/lp/${id}`);
    };

    const { isLoggedIn } = useAuth();
    useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요");
      navigate("/login");
    }
  }, [isLoggedIn, navigate, lpid]);

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid as string),
        enabled: !!lpid,
    });

    const lp = response?.data;

    if (isLoading) return <div className="p-20 text-center text-white">로딩 중...</div>;
    if (isError) return <div className="p-20 text-center text-red-500">{error.message}</div>;
    if (!lp) return <div className="p-20 text-center text-white">데이터를 찾을 수 없습니다.</div>;

    return (

        <div className="max-w-5xl mx-auto p-6 text-white">
        <button 
            onClick={() => navigate(-1)} 
            className="mb-6 text-gray-400 hover:text-white transition-colors"
        >
            ← 뒤로가기
        </button>

        <div className="flex flex-col md:flex-row gap-10 mb-12">
            <div className="w-full md:w-1/2 aspect-square rounded-xl overflow-hidden bg-white/5 shadow-2xl">
            <img 
                src={lp.thumbnail} 
                alt={lp.title} 
                className="w-full h-full object-cover" 
            />
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-between py-4">
            <div>
                <h1 className="text-4xl font-black mb-4">{lp.title}</h1>
                <div className="flex items-center gap-2 text-lg text-gray-300 mb-2">
                <span className="font-semibold">{lp.user?.nickname || "익명"}</span>
                <span className="text-gray-600">|</span>
                <span className="text-sm text-gray-500">
                    {lp.createdAt?.split("T")[0]}
                </span>
                </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-6 py-2.5 rounded-full font-bold transition">
                    ❤️ {lp.likesCount || 0}
                </button>
                </div>
                <div className="flex gap-4 text-sm text-gray-500 border-t border-white/10 pt-4">
                <button className="hover:text-blue-400">수정하기</button>
                <button className="hover:text-red-500">삭제하기</button>
                </div>
            </div>
            </div>
        </div>

        <div className="border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold mb-6 text-pink-500">앨범 소개</h2>
            <div className="text-gray-200 leading-8 text-lg whitespace-pre-wrap min-h-[200px]">
            {lp.content || "등록된 소개글이 없습니다."}
            </div>
        </div>
        </div>
    );
};

export default LpDetailPage;