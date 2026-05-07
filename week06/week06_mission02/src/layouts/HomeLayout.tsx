import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const HomeLayout = () => {
  const { accessToken, logout, userName } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="h-dvh flex flex-col bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white font-sans">
      {/* 헤더 */}
      <nav className="flex items-center justify-between px-4 py-3 border-b border-white/10 backdrop-blur-md bg-black/60 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* 버거 버튼 */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white hover:text-[#e11d48] transition"
            aria-label="메뉴 열기"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link
            to="/lps"
            className="text-[#e11d48] text-lg font-black tracking-[0.05em] drop-shadow-[0_0_10px_rgba(225,29,72,0.7)] hover:opacity-80 transition"
          >
            돌려돌려LP판
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {accessToken ? (
            // 로그인 상태
            <>
              <span className="text-sm text-gray-300">
                {userName ? `${userName}님 반갑습니다.` : "환영합니다."}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            // 비로그인 상태
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm font-medium bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm font-medium bg-[#e11d48] rounded-full shadow-[0_0_15px_rgba(225,29,72,0.4)] hover:bg-[#be123c] transition"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 사이드바 오버레이 (모바일/데스크탑 공통) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 사이드바 */}
        <aside
          className={`fixed top-0 left-0 h-full w-52 bg-[#0d0d0d] border-r border-white/10 z-50 flex flex-col pt-16 pb-8 px-4 gap-6 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-2">
            <Link
              to="/lps"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              찾기
            </Link>
            <Link
              to="/my"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              마이페이지
            </Link>
          </nav>

          {/* 하단 탈퇴하기 */}
          <button className="mt-auto text-xs text-gray-600 hover:text-gray-400 transition text-left">
            탈퇴하기
          </button>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>

      <footer className="p-4 border-t border-white/10 text-center text-gray-500 text-xs">
        <p>© 2026 돌려돌려LP판. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeLayout;
