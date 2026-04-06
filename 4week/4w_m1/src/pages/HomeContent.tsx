// src/pages/HomeContent.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie, MovieResponse } from '../types/movie';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { movieApi } from '../App';

const HomeHighlightCard = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movies/detail/${movie.id}`)}
            className="relative group overflow-hidden rounded-2xl shadow-2xl cursor-pointer transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.02]"
        >
            <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto aspect-[2/3] object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

            <div className="absolute inset-x-0 bottom-0 z-20 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 text-sm">⭐ {movie.vote_average.toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">{movie.release_date.split('-')[0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:text-[#b2dab1] transition-colors">
                    {movie.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                    {movie.overview || "영화 설명이 없습니다."}
                </p>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-[#b2dab1] group-hover:w-1/2 transition-all duration-300 rounded-full" />
            </div>
        </div>
    );
};

const HomeContent = () => {
    const [topMovies, setTopMovies] = useState<Movie[]>([]);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchTopMovies = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                // 피드백 반영: baseURL과 header 이미 설정된 movieApi 인스턴스 사용
                const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
                    movieApi.get<MovieResponse>(`/popular?language=ko-KR&page=1`),
                    movieApi.get<MovieResponse>(`/top_rated?language=ko-KR&page=1`),
                    movieApi.get<MovieResponse>(`/upcoming?language=ko-KR&page=1`)
                ]);
                // 인기, 평점높은, 개봉예정 3개 API 동시 호출
                // const [popularRes, topRatedRes, upcomingRes] = await Promise.all([
                //     axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, {
                //         headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                //     }),
                //     axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`, {
                //         headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                //     }),
                //     axios.get<MovieResponse>(`https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&page=1`, {
                //         headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` }
                //     })
                // ]);

                const firstMovies = [
                    popularRes.data.results[0],
                    topRatedRes.data.results[0],
                    upcomingRes.data.results[0]
                ].filter(Boolean); // 혹시 데이터가 없을 경우를 대비해 필터링해야한다고한다...

                setTopMovies(firstMovies);
            } catch (error) {
                console.error("홈 화면 데이터를 불러오는데 실패했습니다.", error);
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchTopMovies();
    }, []);

    if (isPending) return <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-black"><LoadingSpinner /></div>;
    if (isError) return <div className="text-center text-white p-20 bg-black">데이터를 불러오는 중 에러가 발생했습니다.</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <h1 className="text-4xl font-extrabold mb-12 text-center">
                오늘의 <span className="text-[#b2dab1]">하이라이트</span> 영화
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 max-w-7xl mx-auto">
                {topMovies.map((movie) => (
                    <HomeHighlightCard key={movie.id} movie={movie} />
                ))}
            </div>


        </div>
    );
};

export default HomeContent;