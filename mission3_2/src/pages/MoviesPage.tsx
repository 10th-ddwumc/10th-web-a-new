import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard.tsx';

const MoviesPage = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isError, setIsError] = useState(false);    
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: 'c8f70e8e7afb2bac713c4fda2fe69997',
                language: 'ko-KR',
                page: page
            }
        });
        setMovies(response.data.results);
      } catch (error) {
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
        <p className="mt-4 text-xl font-medium text-gray-600">영화를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-500">데이터 로딩 실패.</h2>
        <p className="text-gray-500 mt-2">네트워크 연결을 확인하거나 나중에 다시 시도해주세요.</p>
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
