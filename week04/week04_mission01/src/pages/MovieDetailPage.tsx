import { useParams } from "react-router-dom";
import type { MovieDetail, Credits } from "../types/movieDetail";
import { getMovieDetail, getMovieCredits } from "../api/movie";
import useCustomFetch from "../hooks/useCustomFetch";
import { LoadingSpinner } from "../components/LoadingSpinner";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: movie,
    isPending: movieLoading,
    isError: movieError,
  } = useCustomFetch<MovieDetail>(() => getMovieDetail(movieId!), [movieId]);

  const {
    data: credits,
    isPending: creditLoading,
    isError: creditError,
  } = useCustomFetch<Credits>(() => getMovieCredits(movieId!), [movieId]);

  const isPending = movieLoading || creditLoading;
  const isError = movieError || creditError;

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );

  if (isError || !movie || !credits)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-black">
        😥 데이터를 불러오는 중 문제가 발생했어요.
      </div>
    );

  const director = credits.crew.find((c) => c.job === "Director");

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="relative h-[70vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="relative -mt-40 px-10 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <div className="text-gray-300 mb-4">
            ⭐ {movie.vote_average} / 10 · {movie.release_date?.slice(0, 4)} ·{" "}
            {movie.runtime}분
          </div>

          <p className="text-gray-200 leading-relaxed mb-6">{movie.overview}</p>

          <div>
            <h2 className="text-xl font-semibold mb-4">감독 / 출연</h2>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {director && (
                <div className="min-w-[120px] text-center">
                  <img
                    src={
                      director.profile_path
                        ? `https://image.tmdb.org/t/p/w185${director.profile_path}`
                        : "https://via.placeholder.com/185x278?text=No+Image"
                    }
                    className="w-full h-40 object-cover rounded-lg mb-2 border-2 border-yellow-400"
                  />
                  <p className="text-sm font-semibold">{director.name}</p>
                  <p className="text-xs text-yellow-400">Director</p>
                </div>
              )}

              {credits.cast
                .filter((actor) => actor.profile_path)
                .slice(0, director?.profile_path ? 14 : 15)
                .map((actor) => (
                  <div key={actor.id} className="min-w-[120px] text-center">
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-semibold">{actor.name}</p>
                    <p className="text-xs text-gray-400">{actor.character}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
