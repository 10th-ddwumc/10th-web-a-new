import './App.css';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import MovieDetailPage from './pages/MovieDetailPage';
import HomeContent from './pages/HomeContent';

//createBrowserRouter v6 -> 이걸 기준으로 함
//react-router-dom v7(next/js, remix)
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true, // path: '' 와 동일한 의미, 기본 자식으로 설정
        element: <HomeContent />,
      },
      {
        path: 'movies/:category',
        element: <MoviePage />,
      },
      {
        path: 'movies/detail/:movieId',
        element: <MovieDetailPage />,
      }
    ],
  },
]);
// movie/upcoming
// movie/popular
// movie/top_rated
// movie/now_playing
// movie?category=popular -> 이게 더 RESTful하긴 함.
// movie/category/{movie_id} -> 이걸로 설계함
function App() {
  return <RouterProvider router={router} />;
}

export default App;