//import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';


// ✅ 탈퇴 mutation hook — LPListPage 사이드바에서도 재사용
export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const [, setUser] = useLocalStorage<UserInfo | null>('user_info', null);

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('http://localhost:8000/v1/users', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
      });
      if (!res.ok) throw new Error('회원 탈퇴에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      navigate('/login');
    },
    onError: (e: Error) => alert(e.message),
  });
};

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<UserInfo | null>('user_info', null);

  // ✅ 로그아웃 useMutation
  const logoutMutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      navigate('/');
    },
  });

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
          <>
            <span className="text-gray-300 text-sm font-medium">
              <span className="text-[#ff007a] font-bold">{user.nickname}</span>님 반갑습니다.
            </span>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {logoutMutation.isPending ? '...' : '로그아웃'}
            </button>
          </>
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

export default Navbar;