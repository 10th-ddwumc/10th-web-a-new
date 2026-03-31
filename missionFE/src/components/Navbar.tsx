import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-black border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div 
        onClick={() => navigate('/')} 
        className="text-[#ff007a] text-xl font-black italic cursor-pointer select-none hover:opacity-80 transition-opacity"
      >
        돌려돌려LP판
      </div>
      <div className="flex gap-3">
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-1.5 text-sm font-bold text-white bg-[#1a1a1a] rounded-lg hover:bg-gray-800"
        >
          로그인
        </button>
        <button className="px-4 py-1.5 text-sm font-bold text-white bg-[#ff007a] rounded-lg">
          회원가입
        </button>
      </div>
    </nav>
  );
};

export default Navbar;