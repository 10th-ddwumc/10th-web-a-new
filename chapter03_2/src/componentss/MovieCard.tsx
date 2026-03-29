import { useState } from "react";
import type { Movie } from "../types/movie";
import { useNavigate, useParams } from "react-router-dom";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({movie}: MovieCardProps) {

    const [isHovered, setIsHoverd] = useState(false);
    const navigate = useNavigate();
    const params = useParams();
    const { category } = useParams();
    return (
    <div
    onClick={() : void | Promise<void> => navigate(`/movies/${category}/${movie.id}`)}
    className="relative rounded-xl shadow-lg overflow-hidden 
    cursor-pointer w-44 transition-transform duration-300 hover:scale-105"
    onMouseEnter={(): void => setIsHoverd(true)}
    onMouseLeave={(): void => setIsHoverd(false)}>

        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={`${movie.title}영화의 이미지`}
        className=""
        />

        {isHovered && (
            <div className="absolute inset-0 bg-linear-to-t from-black/50
            to-transparent backdrop-blur-md flex flex-col justify-center
            items-center text-white p-4">
                <h2 className="text-lg font-bold leading-snug">{movie.title}</h2>
                <p className="text-sm text-gray-300 leading-relaxed mt-2 line-clamp-6">{movie.overview}</p>
                </div>
        )}
    </div>
    );
}