import { useNavigate } from 'react-router-dom';
import useForm from '../hooks/useForm';

const LoginPage = () => {
  const navigate = useNavigate();
  
  const { values, errors, isFormValid, handleChange } = useForm({
    email: '',
    password: ''
  });

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
          <button className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors">
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

        <div className="flex flex-col items-center bg-[#0a0a0a] p-10 rounded-3xl border border-gray-900 shadow-2xl">
          <h2 className="text-3xl font-bold mb-10 text-white tracking-tight">로그인</h2>
          
          <div className="w-full space-y-5">
            <button className="w-full py-4 border border-gray-700 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors">
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
                name="email"
                type="text" 
                value={values.email}
                onChange={handleChange}
                placeholder="이메일을 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {errors.email && <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <input 
                name="password"
                type="password" 
                value={values.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${errors.password ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {errors.password && <p className="text-red-500 text-xs pl-2 animate-pulse">{errors.password}</p>}
            </div>

            <button 
              disabled={!isFormValid}
              className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] ${
                isFormValid 
                ? 'bg-[#ff007a] text-white shadow-lg shadow-[#ff007a]/20 cursor-pointer' 
                : 'bg-[#1a1a1a] text-gray-600 border border-gray-800 cursor-not-allowed opacity-50'
              }`}
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;