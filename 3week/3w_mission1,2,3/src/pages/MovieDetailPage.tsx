import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { MovieDetail, CreditResponse, Cast } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';

const MovieDetailPage = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [cast, setCast] = useState<Cast[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            setIsPending(true);
            try {
                const [detailRes, creditRes] = await Promise.all([
                    axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    }),
                    axios.get<CreditResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                    })
                ]);

                setMovie(detailRes.data);
                setCast(creditRes.data.cast);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovieData();
    }, [movieId]);

    if (isPending) return <div className='flex justify-center items-center h-screen bg-black'><LoadingSpinner /></div>;
    if (isError || !movie) return <div className='text-center text-white mt-10'>에러가 발생했습니다.</div>;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative w-full h-[450px] overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                        alt="backdrop"
                        className="w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                </div>

                <div className="relative z-10 p-10 md:p-20 flex flex-col justify-center h-full max-w-4xl">
                    <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                    <div className="flex gap-4 text-lg mb-4 text-gray-300">
                        <span>평균 {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.release_date.split('-')[0]}</span>
                        <span>{movie.runtime}분</span>
                    </div>
                    <p className="text-xl italic mb-6 text-[#b2dab1] font-semibold">{movie.tagline}</p>
                    <p className="text-lg leading-relaxed line-clamp-5 text-gray-200">
                        {movie.overview}
                    </p>
                </div>
            </div>

            <div className="p-10 md:px-20">
                <h2 className="text-3xl font-bold mb-10">감독/출연</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-10 gap-x-4">
                    {cast.slice(0, 16).map((person) => (
                        <div key={person.id} className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-gray-600 mb-3 shadow-lg">
                                <img
                                    src={person.profile_path
                                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                                        : 'https://via.placeholder.com/200?text=No+Image'}
                                    alt={person.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="font-bold text-sm truncate w-full">{person.name}</p>
                            <p className="text-xs text-gray-400 truncate w-full">{person.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;