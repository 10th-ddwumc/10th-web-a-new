import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { axiosInstance } from "../apis/axios";

const SignupPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const emailValid = email.includes("@") && email.includes(".");
  const passwordValid = password.length >= 6;
  const passwordMatch = password === passwordCheck;

  // 서버에 가입 데이터를 전송하는 함수
  const handleFinal = async () => {
    try {
      // 1. 서버 API 호출 (URL 경로는 서버 설정에 맞게 확인해주세요)
      const response = await axiosInstance.post("/v1/auth/signup", {
        email,
        password,
        name,
      });

      // 2. 성공 시 처리 (201 Created)
      if (response.status === 201 || response.status === 200) {
        alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
        navigate("/login", { replace: true });
      }
    } catch (error: any) {
      // 3. 에러 처리
      console.error("회원가입 에러:", error);
      const errorMessage =
        error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] flex flex-col gap-8 py-10">
        <div className="flex items-center justify-center relative">
          <button
            onClick={() => {
              if (step === 1) navigate(-1);
              else setStep(step - 1);
            }}
            className="absolute left-0 text-gray-400 hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-xl font-bold tracking-[0.05em]">
            {step === 1 && "회원가입"}
            {step === 2 && "비밀번호 설정"}
            {step === 3 && "닉네임 설정"}
          </h1>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <button className="w-full flex items-center justify-center gap-3 py-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition">
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="google"
              />
              <span className="text-sm font-medium">구글로 시작하기</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            <div className="flex flex-col gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요!"
                className={`w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm
                focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40
                ${!emailValid && email ? "border-red-500" : ""}`}
              />
              {!emailValid && email && (
                <span className="text-red-400 text-xs">
                  올바른 이메일 형식을 입력해주세요.
                </span>
              )}
            </div>

            <button
              disabled={!emailValid}
              onClick={() => setStep(2)}
              className={`w-full py-4 rounded-xl font-bold transition
              ${
                emailValid
                  ? "bg-[#e11d48] hover:bg-[#be123c]"
                  : "bg-white/10 text-gray-600 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fadeIn">
            <div className="text-center py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400">
              {email}
            </div>

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (6자 이상)"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm
                focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPw2 ? "text" : "password"}
                value={passwordCheck}
                onChange={(e) => setPasswordCheck(e.target.value)}
                placeholder="비밀번호 확인"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm
                focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40"
              />
              <button
                type="button"
                onClick={() => setShowPw2(!showPw2)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPw2 ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {(password && !passwordValid) ||
            (passwordCheck && !passwordMatch) ? (
              <span className="text-red-400 text-xs text-center">
                {!passwordValid
                  ? "비밀번호는 6자 이상이어야 합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </span>
            ) : null}

            <button
              disabled={!passwordValid || !passwordMatch}
              onClick={() => setStep(3)}
              className={`w-full py-4 rounded-xl font-bold transition
              ${
                passwordValid && passwordMatch
                  ? "bg-[#e11d48] hover:bg-[#be123c]"
                  : "bg-white/10 text-gray-600 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8 animate-fadeIn">
            <div className="flex justify-center py-2">
              <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center translate-y-3">
                  <div className="w-9 h-9 bg-white/15 rounded-full mb-1" />
                  <div className="w-16 h-12 bg-white/15 rounded-t-[40px]" />
                </div>
              </div>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력해주세요!"
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-sm
              focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40"
            />

            <button
              disabled={!name}
              onClick={handleFinal}
              className={`w-full py-4 rounded-xl font-bold transition
              ${
                name
                  ? "bg-[#e11d48] hover:bg-[#be123c]"
                  : "bg-white/10 text-gray-600 cursor-not-allowed"
              }`}
            >
              회원가입 완료
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;
