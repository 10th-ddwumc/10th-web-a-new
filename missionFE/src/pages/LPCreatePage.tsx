import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LPCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="max-w-md mx-auto pt-10 px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-gray-400 hover:text-white flex items-center gap-2 group transition-colors"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">뒤로가기</span>
        </button>

        <div className="bg-[#0a0a0a] p-8 rounded-3xl border border-gray-900">
          <h1 className="text-2xl font-black text-white mb-8">LP 추가하기</h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="앨범명"
              className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none placeholder:text-gray-600"
            />
            <input
              type="text"
              placeholder="아티스트명"
              className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none placeholder:text-gray-600"
            />
            <button className="w-full py-4 bg-[#ff007a] text-white font-bold rounded-2xl hover:bg-[#e6006e] transition-all">
              추가하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LPCreatePage;