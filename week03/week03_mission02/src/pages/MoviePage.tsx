import { useEffect, useState } from "react";
<<<<<<< Updated upstream
import axios from "axios";
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
=======
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getMoviesByCategory } from "../api/movie";
>>>>>>> Stashed changes

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);

<<<<<<< Updated upstream
  const { category } = useParams<{
    category: string;
  }>();

  useEffect(() => {
    setPage(1);
=======
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    setPage(1);
    setMovies([]);
>>>>>>> Stashed changes
  }, [category]);

  useEffect(() => {
    const fetchMovies = async () => {
<<<<<<< Updated upstream
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
=======
      if (!category) return;

      setIsPending(true);
      setIsError(false);

      try {
        const data = await getMoviesByCategory(category, page);
        setMovies(data.results);
      } catch (error) {
>>>>>>> Stashed changes
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
        <span className="text-red-500 text-2xl">에러가 발생했습니다.</span>
      </div>
    );
  }
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          transition-all duration-150 disabled:opacity-30"
=======
          transition-all duration-150"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
=======
          md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
>>>>>>> Stashed changes
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
