import { useState } from "react"; // 1. useState 추가
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Homepage = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // 2. 모바일 사이드바 열림/닫힘 상태 관리
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsSidebarOpen(false); // 로그아웃 시 사이드바 닫기
    navigate("/");
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative">
      
      {/* 3. 모바일용 배경 어두워짐 레이어 (사이드바가 열렸을 때 뒷배경 클릭 시 닫히게 설정) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 4. 사이드바: 모바일에서는 숨김/슬라이드인, 데스크톱(md 이상)에서는 항상 표시 */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between p-8 bg-black border-r border-white/5 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          {/* 사이드바 상단 로고 */}
          <div className="flex items-center justify-between mb-16">
            <Link to="/" onClick={() => setIsSidebarOpen(false)} className="hover:opacity-80 transition-all">
              <h1 className="text-3xl font-black text-[#FF2D86] tracking-tighter uppercase">DOLIGO</h1>
            </Link>
            {/* 모바일에서만 보이는 닫기(X) 버튼 */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-white/50 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="space-y-6">
            {/* 링크 클릭 시 모바일에서는 사이드바가 자동으로 닫히도록 onClick 추가 */}
            <Link 
              to="/" 
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-4 text-white hover:text-[#FF2D86] transition-all"
            >
              <span>찾기</span>
            </Link>
            <Link 
              to="/mypage" 
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center gap-4 text-white hover:text-[#FF2D86] transition-all"
            >
              <span>마이페이지</span>
            </Link>
          </nav>
        </div>

        {isLoggedIn && (
          <button className="text-sm text-gray-500 hover:text-white transition-colors text-left font-medium">
            탈퇴하기
          </button>
        )}
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col relative">
        {/* 헤더 */}
        <header className="h-20 flex items-center justify-between md:justify-end px-6 md:px-10 bg-black/80 backdrop-blur-md border-b border-white/5">
          
          {/* 5. 보내주신 햄버거 버튼 SVG (모바일 화면에서만 노출) */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden text-white p-2 -ml-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                fill="none" 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="4" 
                d="M7.95 11.95h32m-32 12h32m-32 12h32"
              />
            </svg>
          </button>

          {/* 우측 로그인/유저 정보 영역 */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#FF2D86]">
                  <span className="w-2 h-2 bg-[#FF2D86] rounded-full animate-pulse"></span>
                  <span>{user?.name}님 반갑습니다.</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="text-xs font-bold text-white border border-white/20 px-4 py-1.5 rounded hover:bg-white hover:text-black transition-all"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-bold">로그인</Link>
                <Link to="/signup" className="px-6 py-2 bg-[#FF2D86] text-white text-sm font-bold rounded-full">회원가입</Link>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-black">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Homepage;