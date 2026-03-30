import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { MovieDetail, Credits } from '../types/movie';
import { LoadingSpinner } from '../componentss/LoadingSpinner';
import NotFoundPage from './NotFoundPage';
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

    const MovieDetailPage = () => {

    //url 파라미터 가져오기 
    const { movieId } = useParams();
    //영화 상세 
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    //출연진 
    const [credits, setCredits] = useState<Credits | null>(null);
    //로딩상태
    const [isPending, setIsPending] = useState(true);
    //에러 
    const [isError, setIsError] = useState(false);

    useEffect(() => {
    const fetchData = async () => {
        try {
        setIsPending(true);
        setIsError(false);

        const [movieRes, creditsRes] = await Promise.all([axios.get<MovieDetail>(
            `${BASE_URL}/movie/${movieId}?language=ko-KR`,
            {
                headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            }
            ),
            axios.get<Credits>(
            `${BASE_URL}/movie/${movieId}/credits?language=ko-KR`,
            {
                headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            }
            ),
        ]);
        setMovie(movieRes.data);
        setCredits(creditsRes.data);
        } catch {
        setIsError(true);
        } finally {
        setIsPending(false);
        }
    };
    fetchData();
    }, [movieId]);

    if (isPending) return <div className="flex items-center justify-center h-dvh"><LoadingSpinner /></div>;
    if (isError) return <NotFoundPage />;

    const director = credits?.crew?.find(c => c.job === 'Director');

    return (
        <div className="relative min-h-screen text-white">

      <div
        className="fixed inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: `url(${IMG_URL}${movie.backdrop_path || movie.poster_path})` }}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md" />

      <div className="relative z-10 max-w-4xl mx-auto p-8">

        <div className="flex gap-8">
          <img
            src={`${IMG_URL}${movie.poster_path}`}
            alt={movie.title}
            className="w-48 rounded-xl shadow-lg"
          />
          <div className="flex flex-col justify-center gap-2">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="text-gray-300 text-sm">{movie.release_date} · {movie.runtime}분</p>
            <p className="text-yellow-400 font-semibold">★ {movie.vote_average?.toFixed(1)}</p>
            <p className="text-gray-200 text-sm leading-relaxed">{movie.overview}</p>
            <p className="text-gray-400 text-sm">장르: {movie.genres?.map(g => g.name).join(', ')}</p>
            {director && <p className="text-gray-400 text-sm">감독: {director.name}</p>}
          </div>
        </div>

        <h2 className="text-xl font-bold mt-10 mb-4">출연진</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 pb-4">
          {credits?.cast?.slice(0, 10).map(actor => (
            <div key={actor.id} className="flex flex-col items-center min-w-20">
              <img
                src={actor.profile_path 
                    ? `${IMG_URL}${actor.profile_path}` 
                    : '/profile.jpg'}
                    onError={(e) => {
                        e.currentTarget.src ='/profile.jpg'
                    }}
                alt={actor.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="text-xs text-center mt-2">{actor.name}</p>
              <p className="text-xs text-center text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MovieDetailPage;