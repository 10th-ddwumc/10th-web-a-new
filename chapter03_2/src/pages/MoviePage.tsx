import { useEffect, useState } from "react";
import axios from 'axios';
import type { Movie, MovieResponse } from "../types/movie";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";

export default function MoviePage() {

        const [movies, setMovies] = useState<Movie[]>([]);

        //로당상태
        const [isPending, setIsPending] = useState(false);
        //에러상태
        const [isError, setIsError] = useState(false);
        //페이지
        const[page,setPage] = useState(1);

        const {category} = useParams<{
            category: string;
        }>();

    
    useEffect(():void => {

        const fetchMovies = async(): Promise<void> => {
            setIsPending(true);  

            try{
            const { data } = await axios.get<MovieResponse>(
                `https://api.themoviedb.org/3/movie/${category}?language=ko-kr&page=${page}`,
                { 
                    headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
            }
        );

        setMovies(data.results);
        setIsPending(false);
    }
    catch { setIsError(true);}
    finally{setIsPending(false);}

    };
    fetchMovies();
},[page, category]);

    if(isError){
        return(
        <div>
            <span className="text-red-500 text-2xl">Error</span>
        </div>
        );
    }
    return (
        <div className="bg-[#fdfdf5]">
       <div className="flex items-center justify-center gap-6 mt-5">
        <button className="bg-[#F4Dadb] text-[#8d3c3e] px-3 py-2 rounded-lg
        shadow-md hover:bg-[#e7e3da] transition-all duration-200
        cursor-pointer disabled:cursor-not-allowed"
        disabled={page===1}
        onClick={():void => setPage((prev):number => prev -1)}>
            {`◀`}
        </button>
        <span>{page} 페이지</span>
        <button className="bg-[#F4Dadb] text-[#8d3c3e] px-3 py-2 rounded-lg
        shadow-md hover:bg-[#e7e3da] transition-all duration-200 cursor-pointer
        "
        onClick={():void => setPage((prev):number => prev +1)}>
            {`▶`}
        </button>
        </div>

        {isPending ? (
            <div className="flex items-center justify-center h-dvh">
                <LoadingSpinner />
            </div>
        ): (
            <div className="
            grid p-10 gap-4
            grid-cols-2
            sm:grid-cols-3 
            md:grid-cols-4 
            lg:grid-cols-5 
            xl:grid-cols-6">
            {movies?.map((movie) => 
            (<MovieCard key={movie.id} movie={movie}/>))}
        </div>
        )}

    </div>
    );
}