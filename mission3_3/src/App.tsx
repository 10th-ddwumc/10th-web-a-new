import { Routes, Route } from 'react-router-dom'; 
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <> 
      <Navbar />
<Routes>
  <Route path="/" element={<Home />} /> 
  <Route path="/movies" element={<MoviesPage />} /> 
  <Route path="/movies/:movieId" element={<MovieDetailPage />} />
</Routes>
    </>
  );
}

export default App;