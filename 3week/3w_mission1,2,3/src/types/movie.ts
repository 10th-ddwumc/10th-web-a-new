

export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

// 영화 상세 정보로 인해 타입 추가

export interface MovieDetail extends Movie {
    tagline: string;
    runtime: number;
    genres: { id: number; name: string }[];
}

export interface Cast {
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
    known_for_department: string;
}

export interface CreditResponse {
    id: number;
    cast: Cast[];
    crew: any[];
}