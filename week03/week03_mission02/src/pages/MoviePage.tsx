import { useEffect, useState } from "react";
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsPending(true);

      try {
        const { data } = await axios.get<MovieResponse>(
          `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );

        setMovies(data.results);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovies();
  }, [category, page]);

  if (isError) {
    return (
      <div>
        <span className="text-red=500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full
          bg-gray-100 border border-gray-300 text-gray-700
          shadow-sm
          hover:bg-gray-200 hover:text-black hover:shadow
          active:scale-95 active:shadow-inner
          transition-all duration-150 disabled:opacity-30"
        >
          {"<"}
        </button>

        <span className="text-sm font-semibold text-gray-700 tracking-wide">
          Page {page}
        </span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full
          bg-gray-100 border border-gray-300 text-gray-700
          shadow-sm
          hover:bg-gray-200 hover:text-black hover:shadow
          active:scale-95 active:shadow-inner
          transition-all duration-150 disabled:opacity-30"
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div
          className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3
        md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
