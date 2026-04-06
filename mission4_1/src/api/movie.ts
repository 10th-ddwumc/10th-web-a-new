import axios from 'axios';
import type { MovieResponse } from '../types/movie'; 

const API_KEY = 'c8f70e8e7afb2bac713c4fda2fe69997';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page: number): Promise<MovieResponse> => {
  const response = await axios.get(`${BASE_URL}/movie/popular`, {
    params: {
      api_key: API_KEY,
      language: 'ko-KR',
      page: page,
    },
  });
  return response.data;
};