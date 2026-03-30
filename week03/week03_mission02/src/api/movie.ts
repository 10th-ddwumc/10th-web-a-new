import axios from "axios";
import type { MovieResponse } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
});

export const getMoviesByCategory = async (
  category: string,
  page: number,
): Promise<MovieResponse> => {
  const { data } = await tmdbClient.get(
    `/movie/${category}?language=ko-KR&page=${page}`,
  );
  return data;
};
