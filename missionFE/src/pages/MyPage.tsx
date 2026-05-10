// src/pages/MyPage.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';

const BASE_URL = 'http://localhost:8000';
const getToken = () => localStorage.getItem('accessToken') ?? '';

interface MyInfo {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

// ─── API 함수 ────────────────────────────────────────────
async function fetchMyInfo(): Promise<MyInfo> {
  const res = await fetch(`${BASE_URL}/v1/users/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('내 정보를 불러오지 못했습니다.');
  const json = await res.json();
  return json.data;
}

async function updateMyInfo(dto: { name?: string; bio?: string; avatar?: string }) {
  const res = await fetch(`${BASE_URL}/v1/users`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error('프로필 수정에 실패했습니다.');
  return res.json();
}

async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/v1/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.');
  const json = await res.json();
  return json.data.imageUrl as string;
}

// ─── 컴포넌트 ────────────────────────────────────────────
const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user] = useLocalStorage<UserInfo | null>('user_info', null);

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 비로그인 보호
  useEffect(() => {
    if (!user?.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  }, [user]);

  // 내 정보 조회
  const { data: myInfo, isLoading } = useQuery({
    queryKey: ['myInfo'],
    queryFn: fetchMyInfo,
    enabled: !!user?.isLoggedIn,
  });

  // 편집 모드 열 때 현재 값으로 초기화
  const openEdit = () => {
    setNameInput(myInfo?.name ?? '');
    setBioInput(myInfo?.bio ?? '');
    setAvatarFile(null);
    setAvatarPreview(null);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // 아바타 파일 선택
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드할 수 있습니다.'); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // 프로필 수정 mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl = myInfo?.avatar;
      // 새 이미지가 있으면 먼저 업로드
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }
      return updateMyInfo({
        name: nameInput.trim() || undefined,
        bio: bioInput.trim() || undefined,  // 빈 문자열이면 undefined (옵션 처리)
        avatar: avatarUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      closeEdit();
    },
    onError: (e: Error) => alert(e.message),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-md px-6">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-800 rounded w-1/2" />
                <div className="h-4 bg-gray-800 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10 w-full">

        {/* ── 프로필 카드 ── */}
        <div className="bg-[#0a0a0a] rounded-3xl border border-gray-800 p-6 flex items-center gap-5">
          {/* 아바타 */}
          <div className="relative shrink-0">
            {myInfo?.avatar ? (
              <img
                src={myInfo.avatar}
                alt="프로필"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=?'; }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-gray-700 flex items-center justify-center text-2xl font-black text-[#ff007a]">
                {myInfo?.name?.[0] ?? '?'}
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-white truncate">{myInfo?.name}</h1>
            {myInfo?.bio && <p className="text-sm text-gray-400 mt-1 truncate">{myInfo.bio}</p>}
            <p className="text-xs text-gray-600 mt-1 truncate">{myInfo?.email}</p>
          </div>

          {/* 설정(수정) 버튼 */}
          <button
            onClick={openEdit}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-gray-700 hover:border-[#ff007a] hover:text-[#ff007a] text-gray-400 transition-all"
            title="프로필 수정"
          >
            ⚙
          </button>
        </div>

        {/* ── 편집 모달 ── */}
        {isEditing && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
          >
            <div className="w-full max-w-md bg-[#0a0a0a] rounded-3xl border border-gray-800 p-6 space-y-5">
              {/* 헤더 */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white">프로필 수정</h2>
                <button
                  onClick={closeEdit}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* 아바타 업로드 */}
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group"
                >
                  {avatarPreview || myInfo?.avatar ? (
                    <img
                      src={avatarPreview ?? myInfo?.avatar}
                      alt="미리보기"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-gray-700 flex items-center justify-center text-2xl font-black text-[#ff007a]">
                      {nameInput?.[0] ?? '?'}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">📷</span>
                  </div>
                </button>
                <span className="text-xs text-gray-600">
                  {avatarFile ? avatarFile.name : '클릭해서 사진 변경'}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* 이름 */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">이름 *</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  maxLength={30}
                  placeholder="이름을 입력하세요"
                  className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none text-white text-sm placeholder:text-gray-600 transition-colors"
                />
              </div>

              {/* Bio (옵션) */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Bio <span className="text-gray-700">(선택)</span></label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="자기소개를 입력하세요 (선택)"
                  className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none text-white text-sm placeholder:text-gray-600 resize-none transition-colors"
                />
              </div>

              {/* 저장 버튼 */}
              <button
                onClick={() => updateMutation.mutate()}
                disabled={!nameInput.trim() || updateMutation.isPending}
                className="w-full py-4 bg-[#ff007a] text-white font-bold rounded-2xl hover:bg-[#e6006e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {updateMutation.isPending ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;