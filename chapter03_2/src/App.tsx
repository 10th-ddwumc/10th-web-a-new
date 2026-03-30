import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import MovieDetailPage from './pages/MovieDetailPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>,
    errorElement: <NotFoundPage/>,
    children: [
    {
      path: 'movies/:category',
      element: <MoviePage/>,
    },
    {
      path: 'movies/:category/:movieId',
      element:<MovieDetailPage/>
    }
    ]
  },
]);

//개봉예정
//인기순
//상영중
//순위


function App() {
  return <RouterProvider router={router} />;
}

export default App;