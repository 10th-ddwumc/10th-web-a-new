import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { postLogout, getMyInfo } from "../apis/auth";
import { axiosInstance } from "../apis/axios";
import { useEffect } from "react";
import { useSidebar } from "../hooks/useSidebar";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Homepage = () => {

  const { isLoggedIn, user, logout: clearAuthContext } = useAuth();
  const navigate = useNavigate();
const { isOpen: isSidebarOpen, open: openSidebar, close: closeSidebar } = useSidebar(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["userMe"],
    queryFn: getMyInfo,
    enabled: isLoggedIn,
  });

    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
              closeSidebar();
          }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
      if (isSidebarOpen) {
          document.body.style.overflow = "hidden";
      } else {
          document.body.style.overflow = "";
      }
      return () => {
          document.body.style.overflow = "";
      };
  }, [isSidebarOpen]);

  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      clearAuthContext();
      closeSidebar();
      navigate("/");
    },
    onError: () => {
      alert("로그아웃 중 오류가 발생했습니다. 강제 로그아웃 합니다.");
      clearAuthContext();
      closeSidebar();
      navigate("/");
    }
  });

  const { mutate: withdrawMutate } = useMutation({
    mutationFn: () => axiosInstance.delete("v1/users"),
    onSuccess: () => {
      alert("탈퇴가 완료되었습니다.");
      localStorage.clear();
      window.location.href = "/login";
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.");
    }
  });

  const handleLogout = () => {
    logoutMutate();
  };

  const handleWithdrawClick = () => {
    setIsWithdrawModalOpen(true);
  };

  const confirmWithdraw = () => {
    withdrawMutate();
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="h-screen w-full bg-[#0a0a0a] text-white flex overflow-hidden font-sans relative">
      
      {(isSidebarOpen || isWithdrawModalOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={() => {
            closeSidebar();
            setIsWithdrawModalOpen(false);
          }}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 flex flex-col justify-between p-8 bg-black border-r border-white/5 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          <div className="flex items-center justify-between mb-16">
            <Link to="/" onClick={() => closeSidebar()} className="hover:opacity-80 transition-all">
              <h1 className="text-3xl font-black text-[#FF2D86] tracking-tighter uppercase">돌리고LP판</h1>
            </Link>
            <button 
              onClick={() => closeSidebar()} 
              className="md:hidden text-white/50 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <nav className="space-y-6">
            <Link 
              to="/Search" 
              onClick={() => closeSidebar()}
              className="flex items-center gap-4 text-white hover:text-[#FF2D86] transition-all"
            >
              <span>찾기</span>
            </Link>
            <Link 
              to="/my" 
              onClick={() => closeSidebar()}
              className="flex items-center gap-4 text-white hover:text-[#FF2D86] transition-all"
            >
              <span>마이페이지</span>
            </Link>
          </nav>
        </div>

        {isLoggedIn && (
          <button 
            onClick={handleWithdrawClick}
            className="text-sm text-gray-500 hover:text-white transition-colors text-left font-medium"
          >
            탈퇴하기
          </button>
        )}
      </aside>

      <div className="flex-1 flex flex-col relative">
        <header className="h-20 flex items-center justify-between md:justify-end px-6 md:px-10 bg-black/80 backdrop-blur-md border-b border-white/5">
          
          <button 
            onClick={() => openSidebar()}
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

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#FF2D86]">
                  <span className="w-2 h-2 bg-[#FF2D86] rounded-full animate-pulse"></span>
                  <span>{userData?.data?.name || user?.name}님 반갑습니다.</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="text-xs font-bold text-white border border-white/20 px-4 py-1.5 rounded hover:bg-white hover:text-black transition-all disabled:opacity-50"
                >
                  {isLoggingOut ? "중..." : "로그아웃"}
                </button>
              </div>
            ) : 
            (
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

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-xs shadow-2xl">
            <h2 className="text-xl font-bold mb-2">회원 탈퇴</h2>
            <p className="text-zinc-400 text-sm mb-6">정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={confirmWithdraw}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
              >
                예
              </button>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;