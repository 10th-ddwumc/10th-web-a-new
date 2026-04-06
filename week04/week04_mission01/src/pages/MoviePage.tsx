import { useState } from "react";
import type { Movie } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getMovies } from "../api/movie";
import useCustomFetch from "../hooks/useCustomFetch";

export default function MoviePage() {
  const [page, setPage] = useState(1);

  const { category } = useParams<{ category: string }>();

  const { data, isPending, isError } = useCustomFetch(
    () => getMovies(category!, page),
    [category, page],
  );

  const movies: Movie[] = data?.results ?? [];

  if (isError) {
    return (
      <div className="flex justify-center mt-10">
        <span className="text-red-500 text-xl">
          😥 데이터를 불러오는 중 문제가 발생했어요.
        </span>
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
          bg-gray-100 border border-gray-300
          hover:bg-gray-200 transition"
        >
          {"<"}
        </button>

        <span className="font-semibold">Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full
          bg-gray-100 border border-gray-300
          hover:bg-gray-200 transition"
        >
          {">"}
        </button>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isPending && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
