import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movies/detail/${movie.id}`)} // navigate로 수정
            className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-full transition-transform transform duration-300 hover:scale-105'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={`${movie.title} 영화의 이미지`}
                className='w-full h-auto rounded-lg shadow-md'
            />
            {isHovered && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-center items-center text-white p-4 rounded-lg">
                    <h2 className="text-base font-bold text-center leading-tight mb-2">{movie.title}</h2>
                    <p className="text-[12px] text-gray-300 leading-normal line-clamp-4">{movie.overview}</p>
                </div>
            )}
        </div>
    );
}