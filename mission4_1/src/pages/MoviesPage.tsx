import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard.tsx';
import { getPopularMovies } from '../api/movie';
import type { Movie } from '../types/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isError, setIsError] = useState(false);    
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(false); 

        const data = await getPopularMovies(page);

        setMovies(data.results);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        setIsError(true); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchMovies();
  }, [page]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
        <p className="mt-4 text-xl font-medium text-gray-600">영화를 불러오는 중입니다... 🍿</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-500">에러발생</h2>
        <p className="text-gray-500 mt-2">네트워크 연결을 확인하거나 나중에 다시 시도해주세요.</p>
        <button 
          onClick={() => setPage(page)} 
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          재시도
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex items-center gap-6 mt-12 mb-20">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1} 
          className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
        >
          이전
        </button>

        <span className="text-xl font-bold text-gray-700">{page} 페이지</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MoviesPage;