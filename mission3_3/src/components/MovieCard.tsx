
interface MovieProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
  };
}

const MovieCard = ({ movie }: MovieProps) => {
  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer bg-black">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:opacity-30"
      />

      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 text-white">
        <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
        <p className="text-xs line-clamp-3">{movie.overview}</p>
      </div>
    </div>
  );
};

export default MovieCard;