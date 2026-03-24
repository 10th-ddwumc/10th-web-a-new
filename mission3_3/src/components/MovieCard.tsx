import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }: any) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="cursor-pointer hover:scale-105 transition-transform duration-300"
      style={{ width: '250px' }}
    >
      <div className="overflow-hidden rounded-xl shadow-lg hover:border-pink-400 border-2 border-transparent">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
          alt={movie.title} 
          className="w-full h-auto"
        />
      </div>
      <h3 className="mt-2 text-center font-bold text-gray-800">{movie.title}</h3>
    </div>
  );
};

export default MovieCard;