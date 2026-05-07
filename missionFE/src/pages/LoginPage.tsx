import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';
import Navbar from '../components/Navbar';

const loginSchema = z.object({
  email: z.string().min(1, { message: "이메일을 입력해주세요." }).email({ message: "올바르지 않은 이메일 형식입니다." }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? '/'; // ✅ 원래 경로
  const [, setUser] = useLocalStorage<UserInfo | null>('user_info', null);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange'
  });
const onSubmit = async (data: LoginFormData) => {
  try {
    // ✅ 실제 백엔드 로그인 API 호출
    const res = await fetch('http://localhost:8000/v1/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    const json = await res.json();
    const { accessToken, refreshToken, name } = json.data;

    // ✅ 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    setUser({
      email: data.email,
      nickname: name,
      isLoggedIn: true,
      joinedAt: new Date().toISOString(),
    });

    const from = localStorage.getItem('loginRedirect') ?? location.state?.from ?? '/';
    localStorage.removeItem('loginRedirect');
    navigate(from);
  } catch {
    alert('로그인 중 오류가 발생했습니다.');
  }
};

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />

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
          <h2 className="text-3xl font-bold mb-10 text-white tracking-tight">로그인</h2>

          <div className="w-full space-y-5">
            <button
              type="button"
              onClick={() => {
                window.location.href = 'http://localhost:8000/v1/auth/google/login';
              }}
              className="w-full py-4 border border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors"
            >
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="w-5 h-5" />
              <span className="font-semibold text-white">구글 로그인</span>
            </button>

            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="mx-4 text-gray-600 text-sm font-medium">OR</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <div className="space-y-2">
              <input
                {...register("email")}
                type="text"
                placeholder="이메일을 입력해주세요!"
                className={`w-full p-4 bg-[#141414] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {errors.email && <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <input
                {...register("password")}
                type="password"
                placeholder="비밀번호를 입력해주세요!"
                className={`w-full p-4 bg-[#141414] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {errors.password && <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.password.message}</p>}
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