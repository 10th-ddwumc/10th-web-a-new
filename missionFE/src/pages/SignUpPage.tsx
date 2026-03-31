import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';


import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';


const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일은 필수 입력입니다." })
    .email({ message: "이메일 형식이 올바르지 않습니다." }),
  password: z
    .string()
    .min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다." }),
  passwordConfirm: z
    .string()
    .min(1, { message: "비밀번호 재확인이 필요합니다." }),
  nickname: z
    .string()
    .min(2, { message: "닉네임은 2자 이상 입력해주세요." }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["passwordConfirm"], 
});


type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);


  const [user, setUser] = useLocalStorage<UserInfo | null>('user_info', null);


  const { 
    register, 
    handleSubmit, 
    watch, 
    trigger, 
    formState: { errors } 
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange'
  });

 
  const emailValue = watch("email", "");
  const passwordValue = watch("password", "");
  const passwordConfirmValue = watch("passwordConfirm", "");
  const nicknameValue = watch("nickname", "");

  const handleNextStep = async (fields: Array<keyof SignUpFormData>) => {
    const isStepValid = await trigger(fields);

    if (step === 2 && (passwordValue !== passwordConfirmValue || !!errors.passwordConfirm)) {
      return;
    }
    
    if (isStepValid) setStep(step + 1);
  };

  // 최종 제출 및 로컬스토리지 저장
  const onSubmit = (data: SignUpFormData) => {
    const newUser: UserInfo = {
      email: data.email,
      nickname: data.nickname,
      isLoggedIn: true,
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    alert(`${data.nickname}님, 회원가입이 완료되었습니다.`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      
    
      <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div 
          onClick={() => navigate('/')} 
          className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity"
        >
          돌려돌려LP판
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors">
            로그인
          </button>
          <button onClick={() => navigate('/signup')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors">
            회원가입
          </button>
        </div>
      </nav>

      <div className="max-w-md mx-auto pt-10 px-6 pb-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          
         
          <button 
            type="button"
            onClick={() => {
              if (step === 3) setStep(2);
              else if (step === 2) setStep(1);
              else navigate(-1);
            }} 
            className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
          >
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-medium text-lg italic">회원가입</span>
          </button>

          <div className="flex flex-col items-center bg-[#0a0a0a] p-10 rounded-3xl border border-gray-900 shadow-2xl">
            <h2 className="text-3xl font-bold mb-10 tracking-tight text-white">회원가입</h2>
            
            <div className="w-full space-y-6">
              
          
              {step === 1 && (
                <>
                  <button type="button" className="w-full py-4 border border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
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
                      placeholder="이메일을 입력해주세요!" 
                      className={`w-full p-4 bg-[#141414] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl outline-none focus:border-[#ff007a] transition-all`}
                    />
                    {errors.email && <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.email.message}</p>}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleNextStep(["email"])}
                    disabled={!emailValue || !!errors.email}
                    className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all ${
                      emailValue && !errors.email ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20' : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    다음
                  </button>
                </>
              )}

           
              {step === 2 && (
                <>
                  <div className="flex items-center gap-2 text-gray-400 font-semibold px-3 py-2 bg-[#1a1a1a] w-fit rounded-full mb-2 text-sm">
                     ✉️ {emailValue}
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <div className="relative">
                        <input 
                          type={showPw ? "text" : "password"} 
                          {...register("password")}
                          placeholder="비밀번호를 입력해주세요" 
                          className={`w-full p-4 bg-[#141414] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-2xl outline-none focus:border-[#ff007a] transition-all`}
                        />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">{showPw ? "🙈" : "👁️"}</button>
                      </div>
                      {errors.password && <p className="text-red-500 text-[11px] pl-2 animate-pulse">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <input 
                          type={showConfirmPw ? "text" : "password"}
                          {...register("passwordConfirm")}
                          placeholder="비밀번호를 다시 한 번 입력해주세요!" 
                          className={`w-full p-4 bg-[#141414] border ${
                            (passwordConfirmValue && passwordValue !== passwordConfirmValue) || errors.passwordConfirm
                            ? 'border-red-500' : 'border-gray-800'
                          } rounded-2xl outline-none focus:border-[#ff007a] transition-all`}
                        />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-lg">{showConfirmPw ? "🙈" : "👁️"}</button>
                      </div>
                     
                      {passwordConfirmValue && passwordValue !== passwordConfirmValue && (
                        <p className="text-red-500 text-[11px] pl-2 animate-pulse font-medium">비밀번호가 일치하지 않습니다.</p>
                      )}
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleNextStep(["password", "passwordConfirm"])}
                    disabled={!passwordValue || !passwordConfirmValue || passwordValue !== passwordConfirmValue || !!errors.password}
                    className={`w-full py-4 mt-6 rounded-2xl font-bold text-lg transition-all ${
                      !errors.password && passwordValue === passwordConfirmValue && passwordConfirmValue
                      ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20 cursor-pointer' 
                      : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 opacity-50'
                    }`}
                  >
                    다음
                  </button>
                </>
              )}

        
              {step === 3 && (
                <div className="flex flex-col items-center space-y-8 animate-fadeIn">
                  <div className="w-28 h-28 bg-[#1a1a1a] rounded-full border-2 border-gray-800 flex items-center justify-center text-5xl">👤</div>
                  <div className="w-full space-y-2">
                    <input 
                      {...register("nickname")}
                      placeholder="닉네임을 입력해주세요" 
                      className={`w-full p-4 bg-[#141414] border ${errors.nickname ? 'border-red-500' : 'border-gray-800'} rounded-2xl outline-none focus:border-[#ff007a] transition-all text-center font-bold`}
                    />
                    {errors.nickname && <p className="text-red-500 text-[11px] text-center animate-pulse">{errors.nickname.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={!nicknameValue || !!errors.nickname}
                    className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all ${
                      nicknameValue && !errors.nickname ? 'bg-[#ff007a] text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-600 opacity-50'
                    }`}
                  >
                    회원가입 완료
                  </button>
                </div>
              )}

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;