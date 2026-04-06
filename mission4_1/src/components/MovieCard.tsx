import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }: any) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="cursor-pointer transition-all duration-300"
      style={{ width: '250px' }}
    >
    
      <div className="relative group overflow-hidden rounded-xl shadow-lg border-2 border-transparent hover:border-pink-400 transition-all duration-300">
   
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-5 overflow-hidden">
          <h3 className="text-white text-lg font-black mb-3 border-b border-pink-500 pb-1 truncate">
            {movie.title}
          </h3>

          <p className="text-white text-xs leading-relaxed line-clamp-[8]">
            {movie.overview || "등록된 줄거리 정보가 없습니다."}
          </p>
        </div>
      </div>

      <h3 className="mt-2 text-center font-bold text-gray-800 group-hover:text-pink-600 transition-colors">
        {movie.title}
      </h3>
    </div>
  );
};

export default MovieCard;