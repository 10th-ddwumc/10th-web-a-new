import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';

// --- 1. Protected Route 컴포넌트 ---
const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    alert("로그인이 필요한 페이지입니다.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};


const Navbar = () => {
  const navigate = useNavigate();
  const isLogin = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert("로그아웃 되었습니다.");
    navigate('/');
    window.location.reload(); // 상태 반영을 위한 새로고침
  };

  return (
    <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div 
        onClick={() => navigate('/')} 
        className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity"
      >
        돌려돌려LP판
      </div>
      <div className="flex gap-3">
        {isLogin ? (
          <button onClick={handleLogout} className="px-4 py-1.5 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            로그아웃
          </button>
        ) : (
          <>
            <button onClick={() => navigate('/login')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors">
              로그인
            </button>
            <button onClick={() => navigate('/signup')} className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors">
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const isLogin = !!localStorage.getItem('accessToken');

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
        {!isLogin ? (
          <>
            <Link to="/login" className="w-full py-4 bg-[#ff007a] text-white rounded-full font-bold text-center text-lg hover:scale-105 transition-transform shadow-lg shadow-[#ff007a]/20">
              로그인 시작하기
            </Link>
            <Link to="/signup" className="w-full py-4 border border-gray-700 rounded-full font-bold text-center text-lg hover:bg-gray-900 transition-colors">
              회원가입
            </Link>
          </>
        ) : (
          <Link to="/premium" className="w-full py-4 bg-[#ff007a] text-white rounded-full font-bold text-center text-lg hover:scale-105 transition-transform">
            한정판 프리미엄 LP
          </Link>
        )}
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
      setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
    } else {
      setPasswordError('');
    }

    const isValid = email.includes('@') && email.includes('.') && password.length >= 6;
    setIsFormValid(isValid);
  }, [email, password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      localStorage.setItem('accessToken', 'dummy_token_12345');
      alert("로그인 성공!");
      navigate('/');
      window.location.reload(); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="max-w-md mx-auto pt-10 px-6">
        <button onClick={() => navigate(-1)} className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors">
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium text-lg italic">Back</span>
        </button>

        <form onSubmit={handleLogin} className="flex flex-col items-center bg-[#0a0a0a] p-10 rounded-3xl border border-gray-900 shadow-2xl">
          <h2 className="text-3xl font-bold mb-10 text-white tracking-tight">로그인</h2>
          
          <div className="w-full space-y-5">
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
              type="submit"
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
        </form>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* 보호된 라우트 (로그인 해야만 접근 가능) */}
        <Route element={<ProtectedRoute />}>
          <Route 
            path="/premium" 
            element={
              <div className="min-h-screen bg-black text-white">
                <Navbar />
                <div className="p-20 text-center text-3xl font-bold">
                  한정판 LP 구매 권한
                </div>
              </div>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;