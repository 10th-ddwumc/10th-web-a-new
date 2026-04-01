import axios from "axios";
import type { MovieResponse } from "../types/movie";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
  },
});

export const getMovies = async (category: string, page: number) => {
  const { data } = await api.get<MovieResponse>(
    `/movie/${category}?language=ko-KR&page=${page}`,
  );
  return data;
};

export const getMovieDetail = async (movieId: string) => {
  const { data } = await api.get(`/movie/${movieId}?language=ko-KR`);
  return data;
};

export const getMovieCredits = async (movieId: string) => {
  const { data } = await api.get(`/movie/${movieId}/credits`);
  return data;
};
