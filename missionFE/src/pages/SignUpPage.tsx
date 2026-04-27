import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';


interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  error?: string;
}

const FormField = ({ register, error, className, ...props }: FormFieldProps) => (
  <div className="space-y-2 w-full">
    <input 
      {...register}
      {...props}
      className={`w-full p-4 bg-[#141414] border ${error ? 'border-red-500' : 'border-gray-800'} rounded-2xl outline-none focus:border-[#ff007a] transition-all placeholder:text-gray-600 ${className}`}
    />
    {error && <p className="text-red-500 text-xs pl-2 animate-pulse">{error}</p>}
  </div>
);


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


const STEP_FIELDS: Record<number, Array<keyof SignUpFormData>> = {
  1: ["email"],
  2: ["password", "passwordConfirm"],
  3: ["nickname"],
};

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

  const values = watch();

  const handleNextStep = async () => {
    const isStepValid = await trigger(STEP_FIELDS[step]);

    if (step === 2 && (values.password !== values.passwordConfirm || !!errors.passwordConfirm)) {
      return;
    }
    
    if (isStepValid) setStep(step + 1);
  };

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
        <div onClick={() => navigate('/')} className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity">
          돌려돌려LP판
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors">로그인</button>
          <button onClick={() => navigate('/signup')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors">회원가입</button>
        </div>
      </nav>

      <div className="max-w-md mx-auto pt-10 px-6 pb-20">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button type="button" onClick={() => { if (step === 3) setStep(2); else if (step === 2) setStep(1); else navigate(-1); }} 
            className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors">
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
                  <div className="relative py-2 flex items-center"><div className="flex-grow border-t border-gray-800"></div><span className="mx-4 text-gray-600 text-sm font-medium">OR</span><div className="flex-grow border-t border-gray-800"></div></div>
                  
                  <FormField 
                    register={register("email")}
                    placeholder="이메일을 입력해주세요!"
                    error={errors.email?.message}
                  />

                  <button type="button" onClick={handleNextStep} disabled={!values.email || !!errors.email}
                    className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all ${values.email && !errors.email ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20' : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 opacity-50 cursor-not-allowed'}`}>
                    다음
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-center gap-2 text-gray-400 font-semibold px-3 py-2 bg-[#1a1a1a] w-fit rounded-full mb-2 text-sm">✉️ {values.email}</div>
                  <div className="space-y-5">
                    <div className="relative">
                      <FormField type={showPw ? "text" : "password"} register={register("password")} placeholder="비밀번호를 입력해주세요" error={errors.password?.message} />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-4 text-lg">{showPw ? "🙈" : "👁️"}</button>
                    </div>
                    <div className="relative">
                      <FormField 
                        type={showConfirmPw ? "text" : "password"} register={register("passwordConfirm")} placeholder="비밀번호를 다시 한 번 입력해주세요!" 
                        error={(values.passwordConfirm && values.password !== values.passwordConfirm) ? "비밀번호가 일치하지 않습니다." : errors.passwordConfirm?.message}
                      />
                      <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-4 top-4 text-lg">{showConfirmPw ? "🙈" : "👁️"}</button>
                    </div>
                  </div>
                  <button type="button" onClick={handleNextStep} disabled={!values.password || !values.passwordConfirm || values.password !== values.passwordConfirm || !!errors.password}
                    className={`w-full py-4 mt-6 rounded-2xl font-bold text-lg transition-all ${!errors.password && values.password === values.passwordConfirm && values.passwordConfirm ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20' : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 opacity-50'}`}>
                    다음
                  </button>
                </>
              )}
              {step === 3 && (
                <div className="flex flex-col items-center space-y-8 animate-fadeIn">
                  <div className="w-28 h-28 bg-[#1a1a1a] rounded-full border-2 border-gray-800 flex items-center justify-center text-5xl">👤</div>
                  <FormField register={register("nickname")} placeholder="닉네임을 입력해주세요" error={errors.nickname?.message} className="text-center font-bold" />
                  <button type="submit" disabled={!values.nickname || !!errors.nickname}
                    className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all ${values.nickname && !errors.nickname ? 'bg-[#ff007a] text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-600 opacity-50'}`}>
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