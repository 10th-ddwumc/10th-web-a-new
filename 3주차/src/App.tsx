import { useState, useEffect } from 'react';

const Home = () => <div className="text-2xl font-bold">홈 페이지</div>;
const About = () => <div className="text-2xl font-bold">어바웃 페이지</div>;
const NotFound = () => <div className="text-2xl font-bold text-red-500">🚫 404 - 찾을 수 없음</div>;

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
    <div className="p-10">
      <nav className="flex gap-4 mb-5">

        <button onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 rounded">Home 가기</button>
        <button onClick={() => navigate('/about')} className="px-4 py-2 bg-gray-200 rounded">About 가기</button>
      </nav>

      <div className="border-t pt-5">
  
        {path === '/' && <Home />}
        {path === '/about' && <About />}
        {path !== '/' && path !== '/about' && <NotFound />}
      </div>
    </div>
  );
}
