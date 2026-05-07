import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useCustomQuery from '../hooks/useCustomQuery';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import useLocalStorage from '../hooks/useLocalStorage';
import type { UserInfo } from '../types/signup';
import Navbar from '../components/Navbar';

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
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState<'asc' | 'desc'>('desc');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ 비로그인 보호
  useEffect(() => {
    if (!user?.isLoggedIn) {
      alert('로그인이 필요한 서비스입니다. 로그인을 해주세요!');
      localStorage.setItem('loginRedirect', `/lp/${id}`);
      navigate('/login', { state: { from: `/lp/${id}` } });
    }
  }, [user]);

  // ✅ 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => setMenuOpenId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // ✅ LP 상세
  const { data, isLoading, isError, refetch } = useCustomQuery<LP>({
    queryKey: ['lp', id ?? ''],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8000/v1/lps/${id}`);
      if (!res.ok) throw new Error('데이터를 불러오지 못했습니다.');
      const json = await res.json();
      return json.data ?? null;
    },
    staleTime: 1000 * 30,
    retry: 2,
  });

  // ✅ 댓글 무한스크롤
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
      const accessToken = localStorage.getItem('accessToken');
      const res = await fetch(
        `http://localhost:8000/v1/lps/${id}/comments?order=${commentSort}&cursor=${cursor}&limit=10`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
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
  });

 useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    { threshold: 0.1, rootMargin: '100px' }
  );
  if (observerRef.current) observer.observe(observerRef.current);
  return () => observer.disconnect();
}, [hasNextPage, fetchNextPage]); // ✅ isFetchingNextPage 제거

  // ✅ 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    const accessToken = localStorage.getItem('accessToken');
    await fetch(`http://localhost:8000/v1/lps/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content: commentText }),
    });
    setCommentText('');
    refetchComments();
  };

  // ✅ 댓글 수정
  const handleUpdateComment = async (commentId: number) => {
    if (!editText.trim()) return;
    const accessToken = localStorage.getItem('accessToken');
    await fetch(`http://localhost:8000/v1/lps/${id}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content: editText }),
    });
    setEditingId(null);
    setEditText('');
    refetchComments();
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    const accessToken = localStorage.getItem('accessToken');
    await fetch(`http://localhost:8000/v1/lps/${id}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    refetchComments();
  };

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
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-[#ff007a] text-white font-bold rounded-xl hover:bg-[#e6006e] transition-all"
            >
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
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x300?text=LP';
                }}
              />
            </div>

            {/* 제목 + 메타 */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white">{data.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>📅 {new Date(data.createdAt).toLocaleDateString('ko-KR')}</span>
                <span>♥ {data.likeCount}</span>
              </div>
            </div>

            {/* 태그 */}
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-[#1a1a1a] text-[#ff007a] text-xs font-bold rounded-full border border-[#ff007a]/30"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 본문 */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-gray-800">
              <p className="text-gray-300 text-sm leading-relaxed">{data.content}</p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-[#ff007a] transition-all border border-gray-800 hover:border-[#ff007a]">
                ♥ 좋아요 {data.likeCount}
              </button>
              <button
                onClick={() => navigate(`/lp/${id}/edit`)}
                className="px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-gray-800 transition-all border border-gray-800"
              >
                수정
              </button>
              <button className="px-6 py-3 bg-[#1a1a1a] text-red-400 font-bold rounded-xl hover:bg-red-900/20 transition-all border border-gray-800 hover:border-red-400">
                삭제
              </button>
            </div>

            {/* 댓글 섹션 */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-white">댓글</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCommentSort('asc')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      commentSort === 'asc'
                        ? 'bg-white text-black'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                  >
                    오래된순
                  </button>
                  <button
                    onClick={() => setCommentSort('desc')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      commentSort === 'desc'
                        ? 'bg-white text-black'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                    }`}
                  >
                    최신순
                  </button>
                </div>
              </div>

              {/* 댓글 입력 */}
              <div className="flex flex-col gap-2 mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="댓글을 입력해주세요"
                    className="flex-1 p-3 bg-[#141414] border border-gray-800 rounded-xl focus:border-[#ff007a] outline-none text-sm placeholder:text-gray-600"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className={`px-4 py-3 font-bold text-sm rounded-xl transition-all ${
                      commentText.trim()
                        ? 'bg-[#ff007a] text-white hover:bg-[#e6006e]'
                        : 'bg-[#1a1a1a] text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    작성
                  </button>
                </div>
                {commentText.length > 0 && commentText.trim().length === 0 && (
                  <p className="text-red-400 text-xs pl-1">공백만 입력할 수 없어요.</p>
                )}
              </div>

              {/* ✅ 초기 로딩 스켈레톤 - 상단 */}
              {isCommentsLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonComment key={i} />
                  ))}
                </div>
              )}

              {/* 댓글 목록 */}
              {comments && Array.isArray(comments) && (
                <div className="space-y-1">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 py-3 border-b border-gray-800"
                    >
                      <div className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center text-xs font-bold text-[#ff007a] shrink-0">
                        {comment.author?.name?.[0] ?? '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {comment.author?.name ?? '알 수 없음'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                            </span>
                          </div>

                          {comment.author?.name === user?.nickname && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpenId(menuOpenId === comment.id ? null : comment.id);
                                }}
                                className="text-gray-400 hover:text-white transition-colors px-2 py-1 text-lg"
                              >
                                ···
                              </button>

                              {menuOpenId === comment.id && (
                                <div className="absolute right-0 top-8 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden w-24">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingId(comment.id);
                                      setEditText(comment.content);
                                      setMenuOpenId(null);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-white hover:bg-gray-800 text-left transition-colors"
                                  >
                                    수정
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteComment(comment.id);
                                      setMenuOpenId(null);
                                    }}
                                    className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800 text-left transition-colors"
                                  >
                                    삭제
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
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateComment(comment.id)}
                              className="flex-1 p-2 bg-[#141414] border border-[#ff007a] rounded-lg text-sm outline-none"
                            />
                            <button
                              onClick={() => handleUpdateComment(comment.id)}
                              className="px-3 py-1 bg-[#ff007a] text-white text-xs font-bold rounded-lg"
                            >
                              완료
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

                  {/* ✅ 추가 로딩 스켈레톤 - 하단 */}
                  {isFetchingNextPage && (
                    <div className="space-y-2 mt-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonComment key={i} />
                      ))}
                    </div>
                  )}

                  {/* ✅ 무한스크롤 트리거 */}
                  <div ref={observerRef} className="h-20" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LPDetailPage;