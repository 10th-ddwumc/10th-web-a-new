import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Navbar, { useDeleteAccount } from '../components/Navbar';
import LpCreateModal, { type LpFormData } from '../components/LpCreateModal';
import ConfirmModal from '../components/ConfirmModal';

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likeCount: number;
  createdAt: string;
}

const BASE_URL = 'http://localhost:8000';

const HamburgerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
  </svg>
);

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-square bg-gray-800 rounded-lg"></div>
    <div className="mt-2 h-3 bg-gray-800 rounded w-3/4"></div>
    <div className="mt-1 h-3 bg-gray-800 rounded w-1/2"></div>
  </div>
);

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/v1/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}` },
    body: formData,
  });
  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.');
  const json = await res.json();
  return json.data.imageUrl as string;
}

async function createLpAPI(formData: LpFormData) {
  let thumbnailUrl = '';
  if (formData.thumbnail) thumbnailUrl = await uploadImage(formData.thumbnail);
  const res = await fetch(`${BASE_URL}/v1/lps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
    },
    body: JSON.stringify({
      title: formData.title,
      content: formData.content,
      tags: formData.tags,
      thumbnail: thumbnailUrl,
      published: true,
    }),
  });
  if (!res.ok) throw new Error('LP 생성에 실패했습니다.');
  return res.json();
}

const LPListPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const deleteMutation = useDeleteAccount();

  const { data, isLoading, isFetchingNextPage, isError, hasNextPage, fetchNextPage, refetch } =
    useInfiniteScroll<LP>({
      queryKey: ['lps', sort],
      queryFn: async (cursor) => {
        const res = await fetch(`${BASE_URL}/v1/lps?order=${sort}&cursor=${cursor}&limit=10`);
        if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
        const json = await res.json();
        return {
          data: json.data.data ?? [],
          nextCursor: json.data.nextCursor ?? null,
          hasNext: json.data.hasNext ?? false,
        };
      },
      staleTime: 1000 * 60 * 5,
    });

  const createLp = useMutation({
    mutationFn: createLpAPI,
    onSuccess: () => { refetch(); setModalOpen(false); },
    onError: (error: Error) => alert(error.message),
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`
          fixed top-16 left-0 h-full w-56 bg-[#0a0a0a] border-r border-gray-800 z-40 px-4 pt-6
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:top-0
        `}>
          <nav className="flex flex-col gap-2">
            <button onClick={() => { navigate('/lp'); setSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-gray-300 hover:text-white transition-all text-left">
              찾기
            </button>
            <button onClick={() => { navigate('/mypage'); setSidebarOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-gray-300 hover:text-white transition-all text-left">
              마이페이지
            </button>
            {/* ✅ 탈퇴하기 → ConfirmModal 오픈 */}
            <button
              onClick={() => { setDeleteModalOpen(true); setSidebarOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#1a1a1a] text-gray-500 hover:text-red-400 transition-all text-left w-full mt-4 border-t border-gray-800 pt-4"
            >
              탈퇴하기
            </button>
          </nav>
        </aside>

        <main className="flex-1 px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white hover:text-[#ff007a] transition-colors">
                <HamburgerIcon />
              </button>
              <h1 className="text-2xl font-black text-white">LP 목록</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSort('asc')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${sort === 'asc' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>오래된순</button>
              <button onClick={() => setSort('desc')} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${sort === 'desc' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>최신순</button>
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {isError && (
            <div className="flex flex-col justify-center items-center h-60 gap-4">
              <p className="text-red-400">데이터를 불러오지 못했습니다.</p>
              <button onClick={() => refetch()} className="px-6 py-2 bg-[#ff007a] text-white font-bold rounded-xl hover:bg-[#e6006e] transition-all">다시 시도</button>
            </div>
          )}

          {data && Array.isArray(data) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {data.map((lp) => (
                <div key={lp.id} onClick={() => navigate(`/lp/${lp.id}`)} className="cursor-pointer group">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900">
                    <img src={lp.thumbnail} alt={lp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=LP'; }} />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-bold truncate">{lp.title}</p>
                      <p className="text-gray-300 text-xs mt-1">{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</p>
                      <p className="text-[#ff007a] text-xs mt-1">♥ {lp.likeCount}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-300 truncate">{lp.title}</p>
                  <p className="text-xs text-gray-500 truncate">{new Date(lp.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
              ))}
            </div>
          )}

          {isFetchingNextPage && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}
          <div ref={observerRef} className="h-10" />
        </main>
      </div>

      <button onClick={() => setModalOpen(true)} className="fixed bottom-8 right-8 w-14 h-14 bg-[#ff007a] text-white text-3xl font-bold rounded-full shadow-lg shadow-[#ff007a]/40 hover:bg-[#e6006e] hover:scale-110 transition-all flex items-center justify-center z-50">+</button>

      <LpCreateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(data) => createLp.mutate(data)} isLoading={createLp.isPending} />

      {/* ✅ 탈퇴 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="정말 탈퇴하시겠어요?"
        description="탈퇴 시 모든 게시글, 댓글, 좋아요 정보가 삭제되며 복구할 수 없습니다."
        confirmLabel="예, 탈퇴할게요"
        cancelLabel="취소"
        danger={true}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
};

export default LPListPage;