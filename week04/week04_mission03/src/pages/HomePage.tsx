import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 text-white">
      <div className="relative mb-14 flex items-center justify-center">
        <div className="absolute w-80 h-80 rounded-full bg-[#e11d48]/10 blur-3xl"></div>

        <div className="relative w-64 h-64 rounded-full border-[12px] border-[#1a1a1a] bg-gradient-to-br from-[#111] to-[#000] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-[spin_12s_linear_infinite]">
          <div className="w-full h-full rounded-full border border-gray-800 flex items-center justify-center">
            <div className="w-5 h-5 bg-[#e11d48] rounded-full shadow-[0_0_20px_rgba(225,29,72,0.8)]"></div>
          </div>
          <div className="absolute top-4 left-6 w-20 h-6 bg-white/10 blur-md rotate-12"></div>
        </div>

        <div className="absolute flex flex-col items-center gap-6">
          <h1 className="text-5xl font-black text-[#e11d48] tracking-tighter drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]">
            돌려돌려
          </h1>
          <h1 className="text-5xl font-black tracking-widest">LP판</h1>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[260px]">
        <button
          onClick={() => navigate("/login")}
          className="group relative px-10 py-3 bg-[#e11d48] text-white font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(225,29,72,0.4)]"
        >
          <span className="relative z-10">로그인</span>
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-10 py-3 border border-[#fb7185] text-[#fb7185] font-semibold text-lg rounded-full transition-all duration-300 hover:bg-[#fb7185]/10 hover:scale-105 active:scale-95"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default HomePage;
