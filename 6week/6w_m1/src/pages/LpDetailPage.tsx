import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/ip";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";

const LpDetailPage = () => {
    const { lpid } = useParams();
    const navigate = useNavigate();

    // lpid를 키에 포함하여 패칭
    const { data, isLoading, isError } = useQuery({
        queryKey: ["lp", lpid],
        queryFn: () => getLpDetail(lpid!),
        enabled: !!lpid
    });

    if (isLoading) return <div className="pt-32 max-w-2xl mx-auto"><LpCardSkeleton /></div>;
    if (isError) return <div className="pt-32 text-center text-white">데이터를 불러오지 못했습니다.</div>;

    const lp = data?.data;

    return (
        <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto text-white">
            <div className="bg-[#1E1E1E] rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-200 rounded-full overflow-hidden">
                            {lp?.authorld} {/* 실제 avatar 데이터 연동 가능 */}
                        </div>
                        <span className="font-bold">작성자</span>
                    </div>
                    <span className="text-gray-400 text-sm">1일 전</span>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">{lp?.title}</h1>
                    <div className="flex gap-4">
                        <button className="text-gray-400 hover:text-white">✏️</button>
                        <button className="text-gray-400 hover:text-white">🗑️</button>
                    </div>
                </div>

                <div className="flex justify-center mb-10">
                    <div className="w-full max-w-md aspect-square rounded-full overflow-hidden border-8 border-gray-800 shadow-2xl animate-spin-slow">
                        <img src={lp?.thumbnail} className="w-full h-full object-cover" alt="album" />
                    </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-center mb-10 whitespace-pre-wrap">
                    {lp?.content}
                </p>

                <div className="flex justify-center gap-2 flex-wrap mb-10">
                    {lp?.tags.map(tag => (
                        <span key={tag.id} className="px-4 py-1 bg-gray-800 rounded-full text-sm text-gray-400">#{tag.name}</span>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button className="flex items-center gap-2 text-2xl hover:scale-110 transition-transform">
                        ❤️ <span className="text-lg">{lp?.likes.length}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LpDetailPage;