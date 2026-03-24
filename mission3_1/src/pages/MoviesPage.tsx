import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get<MovieResponse>(
          'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',
          {
            headers: {
          
              Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjOGY3MGU4ZTdhZmIyYmFjNzEzYzRmZGEyZmU2OTk5NyIsIm5iZiI6MTc3NDMzODIxMS41NjYwMDAyLCJzdWIiOiI2OWMyNDBhMzljZTJjNmRkZmZiMzJmMjQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.ZJxrIS9528xcdldCbYtLeTOC273H1SSQG7a07OEp7-8`,
            },
          }
        );
        console.log("🎬 API 데이터:", data.results);
        setMovies(data.results);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };
    fetchMovies();
  }, []);

  return (

    <div className="p-8 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-orange-400 pb-2 inline-block">
        🎬 현재 인기 있는 영화
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div 
            key={movie.id} 
            className="group relative bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 cursor-pointer border border-gray-100"
          >
            
            <div className="aspect-[2/3] overflow-hidden">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-50"
              />
            </div>

            
            <div className="absolute inset-0 flex flex-col justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 overflow-hidden">
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-1 border-b border-orange-400 pb-1">
                {movie.title}
              </h3>
              <p className="text-gray-200 text-xs line-clamp-[8] leading-relaxed italic">
                {movie.overview || "등록된 줄거리가 없습니다."}
              </p>
            </div>

        
            <div className="p-3 bg-white border-t border-gray-100">
              <h2 className="font-bold text-sm text-gray-900 truncate">{movie.title}</h2>
              <div className="flex justify-between items-center mt-2">
                <p className="text-[10px] text-gray-500">{movie.release_date}</p>
                
                <p className="text-xs text-orange-500 font-bold">⭐ {movie.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;