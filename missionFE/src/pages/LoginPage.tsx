import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "올바르지 않은 이메일 형식입니다." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false); // 비밀번호 보기 상태
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("로그인 데이터:", data);
    alert("로그인에 성공했습니다! 홈으로 이동합니다.");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* --- 상단 네비게이션 --- */}
      <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div 
          onClick={() => navigate('/')} 
          className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity"
        >
          돌려돌려LP판
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg">
            로그인
          </button>
          <button onClick={() => navigate('/signup')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg">
            회원가입
          </button>
        </div>
      </nav>

      <div className="max-w-md mx-auto pt-10 px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">뒤로가기</span>
        </button>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center bg-[#0a0a0a] p-10 rounded-3xl border border-gray-900 shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-10 text-white tracking-tight text-center w-full">로그인</h2>
          
          <div className="w-full space-y-5">
            <button type="button" className="w-full py-4 border border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
              <span className="font-semibold text-white">구글 로그인</span>
            </button>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="mx-4 text-gray-600 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            {/* 이메일 입력 */}
            <div className="space-y-2">
              <input 
                {...register("email")} 
                type="text" 
                placeholder="이메일을 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.email.message}</p>
              )}
            </div>

            {/* 비밀번호 입력 (토글 아이콘 포함) */}
            <div className="space-y-2">
              <div className="relative w-full">
                <input 
                  {...register("password")} 
                  type={showPw ? "text" : "password"} 
                  placeholder="비밀번호를 입력해주세요!" 
                  // pr-14로 아이콘 공간 확보 + 자동완성 배경색 커스텀
                  className={`w-full p-4 pr-14 bg-[#141414] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600 autofill:shadow-[0_0_0_30px_#141414_inset] autofill:text-fill-white`}
                />
                {/* 👁️ 아이콘 버튼 (z-index와 pointer-events로 강제 노출) */}
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPw(!showPw);
                  }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl z-50 cursor-pointer p-1 hover:scale-110 transition-transform select-none active:opacity-50"
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.password.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!isValid} 
              className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
                isValid 
                ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20 cursor-pointer' 
                : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 cursor-not-allowed opacity-50'
              }`}
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;