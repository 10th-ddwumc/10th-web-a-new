import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface MovieDetail {
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  tagline: string;
}

interface Cast {
  id: number;
  name: string;
  character?: string; // 배우일 경우
  job?: string;       // 감독일 경우
  profile_path: string | null;
}



const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [castList, setCastList] = useState<Cast[]>([]);
  const [crewList, setCrewList] = useState<Cast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setIsLoading(true);
        const API_KEY = 'c8f70e8e7afb2bac713c4fda2fe69997'; 
        
        const [detailRes, creditRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: API_KEY, language: 'ko-KR' }
          }),
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            params: { api_key: API_KEY, language: 'ko-KR' }
          })
        ]);

        setMovieDetail(detailRes.data);
        setCastList(creditRes.data.cast);
        setCrewList(creditRes.data.crew);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieData();
  }, [movieId]);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-black text-pink-500 font-bold text-2xl animate-pulse">
      데이터 로딩중...
    </div>
  );

  const director = crewList.find(person => person.job === 'Director');
  
 
  const combinedList = director 
    ? [{ ...director, character: '감독' }, ...castList.slice(0, 11)] 
    : castList.slice(0, 12);

  return (
    <div className="min-h-screen bg-black text-white">
      
      <div className="relative p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
        
        
        <img 
          src={`https://image.tmdb.org/t/p/w500${movieDetail?.poster_path}`} 
          alt={movieDetail?.title}
          className="w-72 md:w-96 rounded-2xl shadow-2xl border-4 border-pink-500 z-10"
        />

        <div className="flex-1 z-10 space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-pink-500 tracking-tight">{movieDetail?.title}</h1>
          
          <div className="flex items-center gap-6 text-xl font-medium text-gray-300">
            <span className="text-yellow-400">⭐ {movieDetail?.vote_average.toFixed(1)}</span>
            <span>|</span>
            <span>{movieDetail?.release_date?.split('-')[0]}년</span>
            <span>|</span>
            <span>{movieDetail?.runtime}분</span>
          </div>

          {movieDetail?.tagline && (
            <p className="text-2xl font-bold italic text-gray-100 border-l-4 border-pink-400 pl-4">"{movieDetail?.tagline}"</p>
          )}

          <p className="text-lg leading-relaxed text-gray-200 bg-gray-900 bg-opacity-50 p-6 rounded-xl shadow-inner">
            {movieDetail?.overview}
          </p>
        </div>
      </div>

     
      <div className="px-8 md:px-16 pb-20">
        <h2 className="text-3xl font-bold text-white mb-10 pb-3 border-b-2 border-pink-500">감독 / 출연</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-x-6 gap-y-10 text-center">
          {combinedList.map((person, index) => (
            <div key={`${person.id}-${index}`} className="group">
          
              <div className={`w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden border-4 
                ${person.job === 'Director' ? 'border-pink-400 scale-105' : 'border-gray-700'} 
                group-hover:border-pink-500 transition-all duration-300 shadow-lg`}>
                <img 
                  src={
                    person.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz7Scan9jzqFAU2vSnS_Yv9Ssh7I6DSpTzCQ&s' 
                      } 
  alt={person.name}
  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
/>
              </div>
              <p className="mt-4 text-base font-bold text-white group-hover:text-pink-400 truncate">{person.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {person.job === 'Director' ? '감독' : person.character}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;