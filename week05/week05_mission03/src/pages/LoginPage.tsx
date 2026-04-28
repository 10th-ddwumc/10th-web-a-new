import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm.ts";
import {
  type UserSigninInformation,
  validateSignIn,
} from "../utils/validate.ts";
import { useAuth } from "../context/AuthContext.tsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignIn,
    });

  // 버튼 비활성화 로직
  const isDisabled =
    Object.values(errors || {}).some((error) => error && error.length > 0) ||
    Object.values(values).some((value) => value === "");

  // 원래의 단순한 handleSubmit 구조로 복구
  const handleSubmit = async () => {
    if (!isDisabled) {
      try {
        const isSuccess = await login({
          email: values.email,
          password: values.password,
        });

        if (isSuccess) {
          // 성공 시 /my로 이동
          navigate("/my");
        }
      } catch (error: any) {
        // 에러 발생 시 경고창
        alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-black via-[#0a0a0a] to-[#111] text-white font-sans">
      <div className="w-full max-w-[400px] p-8 flex flex-col gap-6">
        <div className="flex items-center justify-center relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 text-2xl text-gray-400 hover:text-white transition cursor-pointer"
          >
            &lt;
          </button>
          <h1 className="text-xl font-bold tracking-[0.05em]">로그인</h1>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">구글 로그인</span>
        </button>

        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-xs text-gray-500">OR</span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              {...getInputProps("email")}
              type="email"
              placeholder="이메일을 입력해주세요!"
              className={`w-full p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40 transition-all duration-300 ${
                errors?.email && touched?.email
                  ? "border-red-500 focus:ring-red-500/40"
                  : ""
              }`}
            />
            {errors?.email && touched?.email && (
              <span className="text-red-400 text-xs pl-1">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              {...getInputProps("password")}
              type="password"
              placeholder="비밀번호를 입력해주세요!"
              className={`w-full p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:border-[#e11d48] focus:ring-2 focus:ring-[#e11d48]/40 transition-all duration-300 ${
                errors?.password && touched?.password
                  ? "border-red-500 focus:ring-red-500/40"
                  : ""
              }`}
            />
            {errors?.password && touched?.password && (
              <span className="text-red-400 text-xs pl-1">
                {errors.password}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full py-4 mt-4 rounded-xl text-sm font-bold transition-all duration-300 ${
            isDisabled
              ? "bg-white/10 text-gray-500 cursor-not-allowed"
              : "bg-[#e11d48] text-white shadow-[0_10px_30px_rgba(225,29,72,0.4)] hover:scale-[1.02] hover:bg-[#be123c]"
          }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
