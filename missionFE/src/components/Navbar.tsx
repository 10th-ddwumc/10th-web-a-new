import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isLogin = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    alert("로그아웃 되었습니다.");
    navigate('/');
    window.location.reload(); 
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
          // 로그인 된 상태면 '로그아웃' 버튼 표시
          <button 
            onClick={handleLogout}
            className="px-4 py-1.5 text-sm font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            로그아웃
          </button>
        ) : (
         
          <>
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors"
            >
              로그인
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg hover:bg-[#e6006e] transition-colors"
            >
              회원가입
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;