// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import useCustomQuery from '../hooks/useCustomQuery';

// 테스트용 타입
interface Post {
  id: number;
  title: string;
}

const HomePage = () => {
  const navigate = useNavigate();

  // ✅ useCustomQuery 체감: staleTime 5초 → 5초 안에 재방문하면 fetch 안 나감
  const { data, isLoading, isError } = useCustomQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/posts?_limit=5').then(r => r.json()),
    staleTime: 5000,
    retry: 2,
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-6">
      {/* 배경 (기존 유지) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff007a] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4facfe] rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter italic text-[#ff007a]">
          돌려돌려LP판
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-[300px]">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            로그인 하러가기
          </button>
          <button className="w-full py-4 bg-[#1a1a1a] text-gray-400 font-medium rounded-2xl border border-gray-800 hover:border-gray-600 transition-all">
            서비스 둘러보기
          </button>
        </div>

        {/* ✅ 상태별 UI 체감 */}
        <div className="mt-8 w-full max-w-[300px] text-left">
          {isLoading && <p className="text-gray-400 text-sm">로딩 중...</p>}
          {isError && <p className="text-red-400 text-sm">에러 발생!</p>}
          {data && data.map(post => (
            <p key={post.id} className="text-gray-300 text-xs py-1 border-b border-gray-800">
              {post.title}
            </p>
          ))}
        </div>

        <footer className="mt-20 text-gray-600 text-xs tracking-widest uppercase">
          © 2026 UMC 10TH WEB YUYOMI
        </footer>
      </div>
    </div>
  );
};

export default HomePage;