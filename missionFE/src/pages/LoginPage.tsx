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

    localStorage.setItem('accessToken', 'mock_token_12345');
    
    alert("로그인에 성공했습니다!");
    
    navigate('/', { replace: true });
    window.location.reload(); 
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-md mx-auto pt-20 px-6">
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
            <div className="space-y-2">
              <input 
                {...register("email")} 
                type="text" 
                placeholder="이메일을 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all text-white`}
              />
              {errors.email && <p className="text-red-500 text-xs pl-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <input 
                {...register("password")} 
                type="password" 
                placeholder="비밀번호를 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all text-white`}
              />
              {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={!isValid} 
              className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all ${
                isValid 
                ? 'bg-[#ff007a] text-white cursor-pointer' 
                : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
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