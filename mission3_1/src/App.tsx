import { useState, useEffect } from 'react';
import MoviesPage from './pages/MoviesPage';

const routes: Record<string, React.ReactNode> = {
  '/': (
    <div className="mt-20"> 
      <h1 className="text-3xl font-bold text-blue-600">홈 페이지</h1>
      <p className="mt-2 text-gray-600">직접 만든 SPA 라우터!</p>
    </div>
  ),
  '/about': (
    <div className="mt-20">
      <h1 className="text-3xl font-bold text-green-600">어바웃 페이지</h1>
      <p className="mt-2 text-gray-600">History API의 원리</p>
    </div>
  ),
  '/movies': <MoviesPage />,
};

const NotFound = () => (
  <div className="mt-20 text-red-500 font-bold text-2xl">
    404 - 페이지를 찾을 수 없음
  </div>
);

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  const navItems = [
    { label: 'Home', target: '/' },
    { label: 'About', target: '/about' },
    { label: 'Movies (API 실습)', target: '/movies' },
  ];

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

  const currentPage = routes[path] || <NotFound />;

  return (
    <div className="w-full min-h-screen flex flex-col items-start text-left bg-white">
      <div className="max-w-4xl w-full mx-auto p-8">
        
        <nav className="flex gap-6 mb-8 border-b pb-4 w-full justify-start">
    
          {navItems.map((item) => (
            <button
              key={item.target}
              onClick={() => navigate(item.target)}
              className={`hover:text-blue-500 font-medium transition-colors ${
                path === item.target ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main className="min-h-[400px] w-full">
          {currentPage}
        </main>

        <footer className="mt-10 pt-4 border-t text-left text-gray-400 text-sm w-full">
          © 2026 SPA Router Study Project
        </footer>
      </div>
    </div>
  );
}