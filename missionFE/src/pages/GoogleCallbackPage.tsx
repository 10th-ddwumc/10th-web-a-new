import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setUser] = useLocalStorage<UserInfo | null>('user_info', null);
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && name) {
      setUser({
        email: '',
        nickname: name,
        isLoggedIn: true,
        joinedAt: new Date().toISOString(),
      });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken ?? '');

      // ✅ 원래 가려던 페이지로 복귀
      const from = location.state?.from ?? '/';
      navigate(from, { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">구글 로그인 처리 중...</p>
    </div>
  );
};

export default GoogleCallbackPage;