import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center justify-center px-6">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#ff007a] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4facfe] rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl font-black mb-4 tracking-tighter italic text-[#ff007a]">
          돌려돌려LP판
        </h1>
        
      
        <div className="flex flex-col gap-4 w-full max-w-[300px]">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            로그인 하러가기
          </button>
          
          <button 
            className="w-full py-4 bg-[#1a1a1a] text-gray-400 font-medium rounded-2xl border border-gray-800 hover:border-gray-600 transition-all"
          >
            서비스 둘러보기
          </button>
        </div>

        {/* 하단 푸터 느낌의 텍스트 */}
        <footer className="mt-20 text-gray-600 text-xs tracking-widest uppercase">
          © 2026 UMC 10TH WEB YUYOMI
        </footer>
      </div>
    </div>
  );
};

export default HomePage;