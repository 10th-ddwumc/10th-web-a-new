export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  backdrop_path: string;
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
};

export type Credits = {
  cast: Cast[];
  crew: Crew[];
};
