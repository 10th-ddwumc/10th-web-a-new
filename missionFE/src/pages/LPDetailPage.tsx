import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useCustomQuery from '../hooks/useCustomQuery';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';
import Navbar from '../components/Navbar';

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likeCount: number;
  createdAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

const SkeletonDetail = () => (
  <div className="animate-pulse space-y-4">
    <div className="w-full aspect-square bg-gray-800 rounded-2xl"></div>
    <div className="h-6 bg-gray-800 rounded w-3/4"></div>
    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
    <div className="h-24 bg-gray-800 rounded"></div>
  </div>
);

const LPDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user] = useLocalStorage<UserInfo | null>('user_info', null);

  // ✅ 비로그인 시 경고 후 /login으로 이동
  useEffect(() => {
    if (!user?.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      navigate('/login', { state: { from: `/lp/${id}` } });
    }
  }, [user]);

  const { data, isLoading, isError, refetch } = useCustomQuery<LP>({
    queryKey: ['lp', id ?? ''],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/v1/lps/${id}`);
      if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
      const json = await res.json();
      return json.data ?? null;
    },
    staleTime: 1000 * 30,
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">뒤로가기</span>
        </button>

        {isLoading && <SkeletonDetail />}

        {isError && (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <p className="text-red-400">데이터를 불러오지 못했습니다.</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-[#ff007a] text-white font-bold rounded-xl hover:bg-[#e6006e] transition-all"
            >
              다시 시도
            </button>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-6">
            <div className="w-full aspect-square overflow-hidden rounded-2xl bg-gray-900">
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x300?text=LP';
                }}
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">{data.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📅 {new Date(data.createdAt).toLocaleDateString('ko-KR')}</span>
                <span>♥ {data.likeCount}</span>
              </div>
            </div>

            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-[#1a1a1a] text-[#ff007a] text-xs font-bold rounded-full border border-[#ff007a]/30"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
              <p className="text-gray-300 text-sm leading-relaxed">{data.content}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#ff007a] transition-all border border-gray-800 hover:border-[#ff007a]">
                ♥ 좋아요 {data.likeCount}
              </button>
              <button
                onClick={() => navigate(`/lp/${id}/edit`)}
                className="px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-gray-800 transition-all border border-gray-800"
              >
                수정
              </button>
              <button className="px-6 py-3 bg-[#1a1a1a] text-red-400 font-bold rounded-xl hover:bg-red-900/20 transition-all border border-gray-800 hover:border-red-400">
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LPDetailPage;