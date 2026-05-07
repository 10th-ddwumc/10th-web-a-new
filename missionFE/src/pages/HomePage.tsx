// src/pages/HomePage.tsx
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';

const HomePage = () => {
  const navigate = useNavigate();
  const [user] = useLocalStorage<UserInfo | null>('user_info', null);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden py-20">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff007a] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4facfe] rounded-full blur-[120px]"></div>
        </div>

        <div className="z-10 flex flex-col items-center text-center gap-6 w-full max-w-[400px]">
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-5xl font-black tracking-tighter italic text-[#ff007a]">
              돌려돌려LP판
            </h1>
            <p className="text-gray-400">당신만의 음악 취향을 공유하는 공간</p>
          </div>

          {user?.isLoggedIn ? (
            // ✅ 로그인 상태
            <div className="w-full flex flex-col gap-4 mt-4">
              <button
                onClick={() => navigate('/lp')}
                className="w-full py-4 bg-[#ff007a] text-white font-bold rounded-2xl hover:bg-[#e6006e] transition-all transform hover:scale-105"
              >
                🎵 LP 목록 보기
              </button>

              {/* 한정판 LP 구매 섹션 */}
              <div className="w-full bg-[#0a0a0a] border border-[#ff007a]/30 rounded-2xl p-5 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-[#ff007a] text-white px-2 py-0.5 rounded-full">LIMITED</span>
                  <span className="text-xs text-gray-400">회원 전용</span>
                </div>
                <h2 className="text-lg font-black text-white mb-1">한정판 LP 스토어</h2>
                <p className="text-gray-400 text-sm mb-4">희귀 앨범을 가장 먼저 만나보세요.</p>

                <div className="flex flex-col gap-3">
                  {[
                    { title: 'Miles Davis - Kind of Blue', price: '₩189,000', badge: '🔴 SOLD OUT' },
                    { title: 'The Beatles - Abbey Road', price: '₩210,000', badge: '🟡 잔여 2장' },
                    { title: 'Pink Floyd - The Wall', price: '₩165,000', badge: '🟢 구매 가능' },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center justify-between bg-[#141414] rounded-xl px-4 py-3 cursor-pointer hover:border hover:border-[#ff007a]/50 transition-all"
                    >
                      <div>
                        <p className="text-white text-sm font-bold">{item.title}</p>
                        <p className="text-[#ff007a] text-xs font-medium mt-0.5">{item.price}</p>
                      </div>
                      <span className="text-xs text-gray-400">{item.badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // ✅ 비로그인 상태
            <div className="w-full flex flex-col gap-4 mt-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                로그인 하러가기
              </button>
              <button
                onClick={() => navigate('/lp')}
                className="w-full py-4 bg-[#1a1a1a] text-gray-400 font-medium rounded-2xl border border-gray-800 hover:border-gray-600 transition-all"
              >
                서비스 둘러보기
              </button>

              {/* 잠긴 한정판 섹션 */}
              <div className="w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 text-left relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-sm bg-black/60 z-10 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">🔒</span>
                  <p className="text-white font-bold text-sm">로그인 후 이용 가능</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-1 px-4 py-1.5 bg-[#ff007a] text-white text-xs font-bold rounded-full hover:bg-[#e6006e] transition-all"
                  >
                    로그인하기
                  </button>
                </div>
                <div className="opacity-30">
                  <h2 className="text-lg font-black text-white mb-1">한정판 LP 스토어</h2>
                  <p className="text-gray-400 text-sm mb-4">희귀 앨범을 가장 먼저 만나보세요.</p>
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-[#141414] rounded-xl"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <footer className="mt-8 text-gray-600 text-xs tracking-widest uppercase">
            © 2026 UMC 10TH WEB YUYOMI
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;