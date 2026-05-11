import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useCustomQuery, { cache } from '../hooks/useCustomQuery';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';

const BASE_URL = 'http://localhost:8000';
const getToken = () => localStorage.getItem('accessToken') ?? '';

interface LP {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  likeCount: number;
  createdAt: string;
  tags: { id: number; name: string }[];
  likes: { id: number; userId: number; lpId: number }[];
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; name: string };
}

const SkeletonDetail = () => (
  <div className="animate-pulse space-y-4">
    <div className="w-full aspect-square bg-gray-800 rounded-2xl"></div>
    <div className="h-6 bg-gray-800 rounded w-3/4"></div>
    <div className="h-4 bg-gray-800 rounded w-1/4"></div>
    <div className="h-24 bg-gray-800 rounded"></div>
  </div>
);

const SkeletonComment = () => (
  <div className="animate-pulse flex gap-3 py-3">
    <div className="w-8 h-8 bg-gray-800 rounded-full shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-800 rounded w-1/4"></div>
      <div className="h-3 bg-gray-800 rounded w-3/4"></div>
    </div>
  </div>
);

const LPDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user] = useLocalStorage<UserInfo | null>('user_info', null);

  // 댓글 상태
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // LP 수정 상태
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [lpTitle, setLpTitle] = useState('');
  const [lpContent, setLpContent] = useState('');

  // LP 삭제 확인 모달
  const [showDeleteLpModal, setShowDeleteLpModal] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ myInfo를 ref로도 저장 (mutation 클로저 안에서 안전하게 접근)
  const myInfoRef = useRef<{ id: number } | null>(null);

  // 비로그인 보호
  useEffect(() => {
    if (!user?.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      localStorage.setItem('loginRedirect', `/lp/${id}`);
      navigate('/login', { state: { from: `/lp/${id}` } });
    }
  }, [user]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ── 내 유저 ID 조회 ───────────────────────────────────
  const { data: myInfo } = useCustomQuery<{ id: number }>({
    queryKey: ['myId'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/users/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('유저 정보 조회 실패');
      const json = await res.json();
      return json.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!user?.isLoggedIn,
  });

  // myInfo가 바뀔 때마다 ref 동기화
  useEffect(() => {
    if (myInfo) myInfoRef.current = myInfo;
  }, [myInfo]);

  // ── LP 상세 조회 ──────────────────────────────────────
  const { data, isLoading, isError, refetch } = useCustomQuery<LP>({
    queryKey: ['lp', id ?? ''],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}`);
      if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
      const json = await res.json();
      return json.data ?? null;
    },
    staleTime: 0,
    retry: 2,
    enabled: !!user?.isLoggedIn,
  });

  // ✅ 렌더 시점 isLiked (버튼 색상용)
  const isLiked = data?.likes?.some((l) => l.userId === myInfoRef.current?.id) ?? false;

  // ── 댓글 무한스크롤 ───────────────────────────────────
  const {
    data: comments,
    isLoading: isCommentsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: refetchComments,
  } = useInfiniteScroll<Comment>({
    queryKey: ['lpComments', id ?? '', commentSort],
    queryFn: async (cursor) => {
      const res = await fetch(
        `${BASE_URL}/v1/lps/${id}/comments?order=${commentSort}&cursor=${cursor}&limit=10`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.ok) throw new Error('댓글을 불러오지 못했습니다.');
      const json = await res.json();
      return {
        data: json.data.data ?? [],
        nextCursor: json.data.nextCursor ?? null,
        hasNext: json.data.hasNext ?? false,
      };
    },
    staleTime: 1000 * 30,
    enabled: !!user?.isLoggedIn,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // ── LP 수정 mutation ──────────────────────────────────
  const updateLp = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ title: lpTitle.trim(), content: lpContent.trim() }),
      });
      if (!res.ok) throw new Error('LP 수정에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => {
      // ✅ 캐시 강제 삭제 후 refetch → 즉시 반영
      cache.delete(`lp-${id}`);
      refetch();
      setIsEditingLp(false);
    },
    onError: (e: Error) => alert(e.message),
  });

  // ── LP 삭제 mutation ──────────────────────────────────
  const deleteLp = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('LP 삭제에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => navigate('/lp'),
    onError: (e: Error) => alert(e.message),
  });

  // ── 좋아요 토글 mutation (낙관적 업데이트) ───────────
  const [optimisticLikes, setOptimisticLikes] = useState<LP['likes'] | null>(null);

  // 실제 표시할 likes: 낙관적 상태가 있으면 그걸 우선 사용
  const displayLikes = optimisticLikes ?? data?.likes ?? [];
  const displayIsLiked = displayLikes.some((l) => l.userId === myInfoRef.current?.id);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const currentlyLiked = data?.likes?.some((l) => l.userId === myInfoRef.current?.id) ?? false;
      const method = currentlyLiked ? 'DELETE' : 'POST';
      const res = await fetch(`${BASE_URL}/v1/lps/${id}/likes`, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('좋아요 처리에 실패했습니다.');
      return res.json();
    },

    // ✅ onMutate: 서버 응답 전에 UI 즉시 반영
    onMutate: () => {
      const myId = myInfoRef.current?.id;
      if (!myId || !data) return;

      const currentlyLiked = data.likes.some((l) => l.userId === myId);

      if (currentlyLiked) {
        // 좋아요 취소: likes 배열에서 제거
        setOptimisticLikes(data.likes.filter((l) => l.userId !== myId));
      } else {
        // 좋아요 추가: 임시 항목 추가
        setOptimisticLikes([...data.likes, { id: Date.now(), userId: myId, lpId: Number(id) }]);
      }
    },

    onSuccess: () => {
      // 서버 데이터로 최종 동기화 후 낙관적 상태 초기화
      cache.delete(`lp-${id}`);
      refetch();
      setOptimisticLikes(null);
    },

    onError: (e: Error) => {
      // 실패 시 낙관적 상태 롤백
      setOptimisticLikes(null);
      alert(e.message);
    },
  });

  // ── 댓글 작성 mutation ────────────────────────────────
  const createComment = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('댓글 작성에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => { setCommentText(''); refetchComments(); },
    onError: () => alert('댓글 작성에 실패했습니다.'),
  });

  // ── 댓글 수정 mutation ────────────────────────────────
  const updateComment = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: number; content: string }) => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error('댓글 수정에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => { setEditingId(null); setEditText(''); refetchComments(); },
    onError: () => alert('댓글 수정에 실패했습니다.'),
  });

  // ── 댓글 삭제 mutation ────────────────────────────────
  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      const res = await fetch(`${BASE_URL}/v1/lps/${id}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('댓글 삭제에 실패했습니다.');
      return res.json();
    },
    onSuccess: () => refetchComments(),
    onError: () => alert('댓글 삭제에 실패했습니다.'),
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8 w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">뒤로가기</span>
        </button>

        {isLoading && <SkeletonDetail />}

        {isError && (
          <div className="flex flex-col items-center justify-center h-60 gap-4">
            <p className="text-red-400">데이터를 불러오지 못했습니다.</p>
            <button onClick={() => refetch()} className="px-6 py-2 bg-[#ff007a] text-white font-bold rounded-xl hover:bg-[#e6006e] transition-all">
              다시 시도
            </button>
          </div>
        )}

        {data && (
          <div className="flex flex-col gap-6">
            {/* 썸네일 */}
            <div className="w-full aspect-square overflow-hidden rounded-2xl bg-gray-900">
              <img
                src={data.thumbnail}
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300?text=LP'; }}
              />
            </div>

            {/* ── LP 수정 모드 / 일반 모드 ── */}
            {isEditingLp ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={lpTitle}
                  onChange={(e) => setLpTitle(e.target.value)}
                  className="w-full p-4 bg-[#141414] border border-[#ff007a] rounded-2xl outline-none text-white text-xl font-black"
                />
                <textarea
                  value={lpContent}
                  onChange={(e) => setLpContent(e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl outline-none text-white text-sm resize-none focus:border-[#ff007a] transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => updateLp.mutate()}
                    disabled={!lpTitle.trim() || updateLp.isPending}
                    className="flex-1 py-3 bg-[#ff007a] text-white font-bold rounded-xl hover:bg-[#e6006e] disabled:opacity-30 transition-all"
                  >
                    {updateLp.isPending ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => setIsEditingLp(false)}
                    className="px-6 py-3 bg-[#1a1a1a] text-gray-400 font-bold rounded-xl hover:bg-gray-800 transition-all border border-gray-700"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h1 className="text-2xl font-black text-white">{data.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>📅 {new Date(data.createdAt).toLocaleDateString('ko-KR')}</span>
                    <span>♥ {displayLikes.length}</span>
                  </div>
                </div>

                {data.tags && data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.tags.map((tag) => (
                      <span key={tag.id} className="px-3 py-1 bg-[#1a1a1a] text-[#ff007a] text-xs font-bold rounded-full border border-[#ff007a]/30">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
                  <p className="text-gray-300 text-sm leading-relaxed">{data.content}</p>
                </div>

                <div className="flex gap-3">
                  {/* ✅ 좋아요 버튼 - 낙관적 업데이트 적용 */}
                  <button
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending || !myInfoRef.current}
                    className={`flex-1 py-3 font-bold rounded-xl transition-all border ${
                      displayIsLiked
                        ? 'bg-[#ff007a] text-white border-[#ff007a]'
                        : 'bg-[#1a1a1a] text-white border-gray-800 hover:bg-[#ff007a] hover:border-[#ff007a]'
                    } disabled:opacity-50`}
                  >
                    ♥ 좋아요 {displayLikes.length}
                  </button>

                  <button
                    onClick={() => { setLpTitle(data.title); setLpContent(data.content); setIsEditingLp(true); }}
                    className="px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-gray-800 transition-all border border-gray-800"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => setShowDeleteLpModal(true)}
                    className="px-6 py-3 bg-[#1a1a1a] text-red-400 font-bold rounded-xl hover:bg-red-900/20 transition-all border border-gray-800 hover:border-red-400"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}

            {/* ── 댓글 섹션 ── */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-white">댓글</h2>
                <div className="flex gap-2">
                  <button onClick={() => setCommentSort('asc')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${commentSort === 'asc' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>오래된순</button>
                  <button onClick={() => setCommentSort('desc')} className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${commentSort === 'desc' ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-400 hover:text-white'}`}>최신순</button>
                </div>
              </div>

              {/* 댓글 입력 */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createComment.mutate(commentText)}
                    placeholder="댓글을 입력해주세요"
                    className="flex-1 p-3 bg-[#141414] border border-gray-800 rounded-xl focus:border-[#ff007a] outline-none text-sm placeholder:text-gray-600"
                  />
                  <button
                    onClick={() => createComment.mutate(commentText)}
                    disabled={!commentText.trim() || createComment.isPending}
                    className={`px-4 py-3 font-bold text-sm rounded-xl transition-all ${
                      commentText.trim() && !createComment.isPending
                        ? 'bg-[#ff007a] text-white hover:bg-[#e6006e]'
                        : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {createComment.isPending ? '...' : '작성'}
                  </button>
                </div>
                {commentText.length > 0 && commentText.trim().length === 0 && (
                  <p className="text-red-400 text-xs pl-1">공백만 입력할 수 없어요.</p>
                )}
              </div>

              {isCommentsLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonComment key={i} />)}
                </div>
              )}

              {comments && Array.isArray(comments) && (
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 py-3 border-b border-gray-800">
                      <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-xs font-bold text-[#ff007a] shrink-0">
                        {comment.author?.name?.[0] ?? '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{comment.author?.name ?? '알 수 없음'}</span>
                            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                          </div>
                          {comment.author?.name === user?.nickname && (
                            <div className="relative">
                              <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === comment.id ? null : comment.id); }}
                                className="text-gray-400 hover:text-white transition-colors px-2 py-1 text-lg"
                              >
                                ···
                              </button>
                              {menuOpenId === comment.id && (
                                <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden w-24">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setEditingId(comment.id); setEditText(comment.content); setMenuOpenId(null); }}
                                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 text-left transition-colors"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); if (confirm('댓글을 삭제할까요?')) deleteComment.mutate(comment.id); setMenuOpenId(null); }}
                                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 text-left transition-colors"
                                  >
                                    {deleteComment.isPending ? '...' : '삭제'}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {editingId === comment.id ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && updateComment.mutate({ commentId: comment.id, content: editText })}
                              className="flex-1 p-2 bg-[#141414] border border-[#ff007a] rounded-lg text-sm outline-none"
                            />
                            <button
                              onClick={() => updateComment.mutate({ commentId: comment.id, content: editText })}
                              disabled={updateComment.isPending}
                              className="px-3 py-1 bg-[#ff007a] text-white text-xs font-bold rounded-lg disabled:opacity-50"
                            >
                              {updateComment.isPending ? '...' : '완료'}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-[#1a1a1a] text-gray-400 text-xs font-bold rounded-lg"
                            >
                              취소
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-300">{comment.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isFetchingNextPage && (
                    <div className="space-y-2 mt-2">
                      {Array.from({ length: 3 }).map((_, i) => <SkeletonComment key={i} />)}
                    </div>
                  )}
                  <div ref={observerRef} className="h-20" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteLpModal}
        title="LP를 삭제할까요?"
        description="삭제된 LP는 복구할 수 없습니다."
        confirmLabel="삭제"
        cancelLabel="취소"
        danger={true}
        onClose={() => setShowDeleteLpModal(false)}
        onConfirm={() => deleteLp.mutate()}
        isPending={deleteLp.isPending}
      />
    </div>
  );
};

export default LPDetailPage;