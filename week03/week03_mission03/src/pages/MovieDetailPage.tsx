import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import type { MovieDetail, Credits } from "../types/movieDetail";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!movieId) return;

      setIsPending(true);
      setIsError(false);

      try {
        const movieRes = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );

        const creditRes = await axios.get<Credits>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          },
        );

        setMovie(movieRes.data);
        setCredits(creditRes.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        Loading...
      </div>
    );
  if (isError || !movie || !credits)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 bg-black">
        에러 발생
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
                .filter((actor) => actor.profile_path) // 사진 없는 사람 제거
                .slice(0, director?.profile_path ? 14 : 15) // 감독 있으면 14명, 없으면 15명
                .map((actor) => (
                  <div key={actor.id} className="min-w-[120px] text-center">
                    <img
                      src={
                        actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : "https://via.placeholder.com/185x278?text=No+Image"
                      }
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
