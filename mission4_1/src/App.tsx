import { Routes, Route } from 'react-router-dom'; 
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Home from './pages/Home';
import Layout from './components/Layout'; // Layout만 가져오면 됩니다.

function App() {
  return (
    <Routes>
      {/* 부모 루트를 Layout으로 설정하여 모든 페이지에 공통 UI 적용 */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} /> 
        <Route path="/movies" element={<MoviesPage />} /> 
        <Route path="/movies/:movieId" element={<MovieDetailPage />} />
      </Route>
    </Routes>
  );
}

export default App;