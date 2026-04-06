import { useState } from 'react';
import MovieCard from '../components/MovieCard';
import useCustomFetch from '../hooks/useCustomFetch';
import type { MovieResponse } from '../types/movie';

const MoviesPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useCustomFetch<MovieResponse>(
    'https://api.themoviedb.org/3/movie/popular',
    { page }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
        <p className="ml-4 text-xl font-medium text-white">로딩 중... 🍿</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-red-500">데이터를 가져오지 못했어요. 😭</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {data?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="flex items-center gap-6 mt-12 mb-20">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg ${
            page === 1 ? 'bg-gray-600 text-gray-400' : 'bg-orange-500 text-white hover:bg-orange-600'
          }`}
        >
          이전
        </button>
        <span className="text-xl font-bold text-white">{page} 페이지</span>
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