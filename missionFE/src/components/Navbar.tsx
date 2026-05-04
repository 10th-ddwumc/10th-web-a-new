import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<UserInfo | null>('user_info', null);

const handleLogout = () => {
  setUser(null);
  window.location.href = '/'; // ✅ 강제 새로고침으로 이동
};

  return (
    <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div
        onClick={() => navigate('/')}
        className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity"
      >
        돌려돌려LP판
      </div>

      <div className="flex gap-3 items-center">
        {user?.isLoggedIn ? (
          // ✅ 로그인 상태
          <>
            <span className="text-gray-300 text-sm font-medium">
               <span className="text-[#ff007a] font-bold">{user.nickname}</span>님 반갑습니다.
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors"
            >
              로그아웃
            </button>
          </>
        ) : (
          // ✅ 비로그인 상태
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