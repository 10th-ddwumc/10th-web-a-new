import { useEffect, useState } from "react"
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { movieApi } from '../App';
import useCustomFetch from "../hooks/useCustomFetch";


export default function MoviePage() {

    /*const [movies, setMovies] = useState<Movie[]>([]);
    // 1. 로딩 실패
    const [isPending, setIsPending] = useState(false);
    //2. 에러 상태
    const [isError, setIsError] = useState(false);*/
    //3. 페이지 처리
    const [page, setPage] = useState(1);

    const { category } = useParams<{
        category: string;
    }>();

    /*useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            try {
                const { data } = await movieApi.get<MovieResponse>(
                    `/${category}?language=ko-KR&page=${page}`
                );
                // const { data } = await axios.get<MovieResponse>(
                //     `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                //     {
                //         headers: {
                //             Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,

                //         },
                //     }
                // );

                setMovies(data.results);
                //const fetchMovies: () => Promise<void>
                //setIsPending(false); 공통사항이라 finally로 빼는게 좋음

            } catch {
                setIsError(true);
                //setIsPending(false); 공통사항이라 finally로 빼는게 좋음
            } finally {
                setIsPending(false);
            }

        };

        fetchMovies();
    }, [category]);*/
    // 커스텀 훅 사용으로 간결하게 변경

    // 기존에는 movies / isPending / isError 상태를 따로 만들고
    // useEffect 안에서 movieApi.get()을 호출했음
    // 이제는 커스텀 훅이 데이터 / 로딩 / 에러를 대신 관리함
    const {
        data,
        isPending,
        isError
    } = useCustomFetch<MovieResponse>(`/${category}?language=ko-KR&page=${page}`);

    // 카테고리가 바뀌면 페이지를 다시 1페이지로 초기화
    // 예: popular 5페이지에 있다가 top_rated로 이동하면 1페이지부터 보이게
    useEffect(() => {
        setPage(1);
    }, [category]);

    if (isError) {
        return <div className="flex justify-center items-center min-h-[60vh]">
            <span className='text-red-500 text-2xl'>에러가 발생했습니다.</span>
        </div>
    }

    return (
        <>
            <div className='flex items-center justify-center gap-6 mt-5'>
                <button
                    className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
                    hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 
                    cursor-pointer disabled:cursor-not-allowed"
                    disabled={page === 1}
                    onClick={() => setPage((prev => prev - 1))}>
                    {'<'}
                </button>
                <span className="font-bold text-lg font-size-5xl">
                    {page}페이지
                </span>
                <button
                    className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md 
                    hover:bg-[#b2dab1] transition-all duration-200
                    cursor-pointer disabled:cursor-not-allowed"
                    onClick={() => setPage((prev => prev + 1))}>
                    {'>'}
                </button>
            </div>

            {isPending && (
                <div className='flex items-center justify-center h-dvh'>
                    <LoadingSpinner />
                </div>
            )}
            {!isPending && (
                <div className='p-10 grid gap-6 grid-cols-2 sm:grid-cols-3
                md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                    {data?.results?.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}


        </>
    );
}