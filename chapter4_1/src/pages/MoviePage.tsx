import { useState } from "react";
import type { MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Link, useParams } from "react-router-dom";
import useCustomFetch from '../hooks/useCustomFetch';

export default function MoviePage() {
    const [page, setPage] = useState(1);
    const { category } = useParams<{ category: string }>();

    const { data, isLoading: isPending, isError } = useCustomFetch<MovieResponse>(
        `/movie/${category}?language=ko-kr&page=${page}`
    );

    const movies = data?.results || [];

    if (isError) {
        return (
            <div className="flex justify-center mt-10">
                <span className="text-red-500 text-2xl font-bold">에러가 발생했습니다. 잠시 후 다시 시도해주세요.</span>
            </div>
        );
    }

    return (
        <div className="bg-[#fdfdf5]">
            <div className="flex items-center justify-center gap-6 mt-5">
                <button 
                    className="bg-[#F4Dadb] text-[#8d3c3e] px-3 py-2 rounded-lg shadow-md hover:bg-[#e7e3da] transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                >
                    {`◀`}
                </button>
                <span>{page} 페이지</span>
                <button 
                    className="bg-[#F4Dadb] text-[#8d3c3e] px-3 py-2 rounded-lg shadow-md hover:bg-[#e7e3da] transition-all duration-200 cursor-pointer"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    {`▶`}
                </button>
            </div>

            {isPending ? (
                <div className="flex items-center justify-center h-dvh">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="grid p-10 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                        <Link key={movie.id} to={`/movies/${category}/${movie.id}`}>
                            <MovieCard movie={movie} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}