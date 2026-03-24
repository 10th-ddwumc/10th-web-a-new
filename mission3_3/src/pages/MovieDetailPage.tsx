import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {

  const { movieId } = useParams();

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">영화 상세 페이지</h2>
      <p className="text-xl">선택하신 영화의 ID는 <span className="text-orange-500 font-bold">{movieId}</span>입니다.</p>
    </div>
  );
};

export default MovieDetailPage;