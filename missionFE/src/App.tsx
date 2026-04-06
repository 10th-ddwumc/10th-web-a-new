import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff007a] opacity-10 blur-[120px] rounded-full -z-10 animate-pulse"></div>

      <div className="text-center mb-16 px-6">
        <h1 className="text-6xl font-black text-[#ff007a] mb-4 tracking-tighter drop-shadow-[0_0_15px_rgba(255,0,122,0.5)] italic">
          돌려돌려LP판
        </h1>
        <p className="text-gray-400 text-lg font-medium">당신만의 음악 취향을 공유하는 공간</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-[300px] z-10">
        <Link 
          to="/login" 
          className="w-full py-4 bg-[#ff007a] text-white rounded-full font-bold text-center text-lg hover:scale-105 transition-transform shadow-lg shadow-[#ff007a]/20"
        >
          로그인 시작하기
        </Link>
        {/* 🟢 수정: button을 Link로 바꾸어 /signup 연결 */}
        <Link 
          to="/signup" 
          className="w-full py-4 border border-gray-700 rounded-full font-bold text-center text-lg hover:bg-gray-900 transition-colors"
        >
          회원가입
        </Link>
      </div>
      
      <footer className="mt-20 text-gray-600 text-xs tracking-widest uppercase">
        © 2026 UMC 10TH WEB YUYOMI
      </footer>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (email.length > 0 && (!email.includes('@') || !email.includes('.'))) {
      setEmailError('올바르지 않은 이메일 형식입니다.');
    } else {
      setEmailError('');
    }

    if (password.length > 0 && password.length < 6) {
      passwordError === '' && setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
    } else if (password.length >= 6 || password.length === 0) {
      passwordError === '' || setPasswordError('');
    }

    const isValid = email.includes('@') && email.includes('.') && password.length >= 6;
    setIsFormValid(isValid);
  }, [email, password, passwordError]);

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
          {/* 🟢 수정: onClick 이벤트에 navigate('/signup') 추가 */}
          <button 
            onClick={() => navigate('/signup')} 
            className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors"
          >
            회원가입
          </button>
        </div>
      </nav>

      <div className="max-w-md mx-auto pt-10 px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium text-lg italic">Back</span>
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
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${emailError ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {emailError && <p className="text-red-500 text-xs pl-2 animate-pulse">{emailError}</p>}
            </div>

            <div className="space-y-2">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해주세요!" 
                className={`w-full p-4 bg-[#141414] border ${passwordError ? 'border-red-500' : 'border-gray-800'} rounded-2xl focus:border-[#ff007a] outline-none transition-all placeholder:text-gray-600`}
              />
              {passwordError && <p className="text-red-500 text-xs pl-2 animate-pulse">{passwordError}</p>}
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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;