import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home.tsx';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage.tsx';

function App() {
  return (
<Routes>

  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="movies" element={<MoviesPage />} />
    <Route path="movies/:movieId" element={<MovieDetailPage />} />
  </Route> 
</Routes>
  );
}

export default App;