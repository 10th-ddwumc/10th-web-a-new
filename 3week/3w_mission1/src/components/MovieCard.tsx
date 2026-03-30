import type { Movie } from "../types/movie";
import { useState } from "react";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className='relative rounded-xl shadow-lg overflow-hidden cursor-pointer w-50 transition-transform transform duration-300 hover:scale-105'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className='text-lg font-semibold text-gray-800'></h2>
            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={`${movie.title} 영화의 이미지`}
                className='w-48 h-auto rounded-lg shadow-md'
            />
            {isHovered && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-md flex-col justify-center items-center text-white p-5 rounded-lg">
                    <h2 className="text-lg font-bold text-center leading-snug">{movie.title}</h2>
                    <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-5">{movie.overview}</p>
                </div>

            )}
        </div>
    );
}