import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center h-full
                    bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]
                    text-white font-sans"
    >
      <div className="w-full max-w-[400px] p-8 flex flex-col gap-6">
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-2xl text-gray-400 
                       hover:text-white transition"
          >
            &lt;
          </button>

          <h1 className="text-xl font-bold tracking-[0.05em]">회원가입</h1>
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이름"
            className="w-full p-4 rounded-xl
                       bg-white/5 border border-white/10
                       backdrop-blur-md
                       text-white placeholder-gray-400
                       focus:outline-none focus:border-[#e11d48]
                       focus:ring-2 focus:ring-[#e11d48]/40
                       transition-all"
          />

          <input
            type="email"
            placeholder="이메일"
            className="w-full p-4 rounded-xl
                       bg-white/5 border border-white/10
                       backdrop-blur-md
                       text-white placeholder-gray-400
                       focus:outline-none focus:border-[#e11d48]
                       focus:ring-2 focus:ring-[#e11d48]/40
                       transition-all"
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full p-4 rounded-xl
                       bg-white/5 border border-white/10
                       backdrop-blur-md
                       text-white placeholder-gray-400
                       focus:outline-none focus:border-[#e11d48]
                       focus:ring-2 focus:ring-[#e11d48]/40
                       transition-all"
          />
        </div>

        <button
          className="w-full py-4 mt-2 rounded-xl text-sm font-bold 
                     bg-[#e11d48] text-white
                     shadow-[0_10px_30px_rgba(225,29,72,0.4)]
                     hover:scale-[1.02] hover:bg-[#be123c]
                     transition-all"
        >
          회원가입
        </button>

        <div className="text-center text-sm text-gray-400">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-[#e11d48] hover:underline"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
