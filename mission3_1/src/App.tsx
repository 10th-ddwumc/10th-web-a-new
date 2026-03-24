import { useState, useEffect } from 'react';
import MoviesPage from './pages/MoviesPage';


const Home = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-blue-50 rounded-lg">
    <h1 className="text-3xl font-bold text-blue-600">홈 페이지</h1>
    <p className="mt-2 text-gray-600">직접 만든 SPA 라우터!</p>
  </div>
);

const About = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-green-50 rounded-lg">
    <h1 className="text-3xl font-bold text-green-600">어바웃 페이지</h1>
    <p className="mt-2 text-gray-600">History API의 원리</p>
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-lg">
    <h1 className="text-3xl font-bold text-red-600">404 - 페이지를 찾을 수 없음</h1>
  </div>
);

export default function App() {

  const [path, setPath] = useState(window.location.pathname);


  const navigate = (nextPath: string) => {

    window.history.pushState({}, '', nextPath);
 
    setPath(nextPath);
  };

  
  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <nav className="flex gap-6 mb-8 border-b pb-4">
        <button 
          onClick={() => navigate('/')} 
          className={`hover:text-blue-500 font-medium ${path === '/' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Home
        </button>
        <button 
          onClick={() => navigate('/about')} 
          className={`hover:text-blue-500 font-medium ${path === '/about' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          About
        </button>
        <button 
          onClick={() => navigate('/movies')} 
          className={`hover:text-blue-500 font-medium ${path === '/movies' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          Movies (API 실습)
        </button>
      </nav>

      <main className="min-h-[400px]">
        {path === '/' && <Home />}
        {path === '/about' && <About />}
        {path === '/movies' && <MoviesPage />}

        {path !== '/' && path !== '/about' && path !== '/movies' && <NotFound />}
      </main>

      <footer className="mt-10 pt-4 border-t text-center text-gray-400 text-sm">
        © 2026 SPA Router Study Project
      </footer>
    </div>
  );
}