import { Outlet, Link } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div
      className="h-dvh flex flex-col 
                 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]
                 text-white font-sans"
    >
      <nav
        className="flex items-center justify-between px-6 py-4 
                   border-b border-white/10 
                   backdrop-blur-md bg-black/60 sticky top-0 z-50"
      >
        <Link
          to="/"
          className="text-[#e11d48] text-xl font-black tracking-[0.05em]
                     drop-shadow-[0_0_10px_rgba(225,29,72,0.7)]
                     hover:opacity-80 transition"
        >
          돌려돌려LP판
        </Link>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-1.5 text-sm font-medium 
                       bg-white/5 border border-white/10
                       rounded-full
                       hover:bg-white/10 transition"
          >
            로그인
          </Link>

          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm font-medium 
                       bg-[#e11d48] rounded-full
                       shadow-[0_0_15px_rgba(225,29,72,0.4)]
                       hover:bg-[#be123c] transition"
          >
            회원가입
          </Link>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <footer
        className="p-6 border-t border-white/10 
                   text-center text-gray-500 text-xs"
      >
        <p>© 2026 돌려돌려LP판. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomeLayout;
