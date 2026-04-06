
export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string; 
  release_date: string;
  vote_average: number;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export interface Cast {
  id: number;
  name: string;
  character?: string; 
  job?: string;       
  profile_path: string | null;
}

export interface MovieDetail extends Movie {
  tagline: string;
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: Cast[];
    crew: Cast[];
  };
}