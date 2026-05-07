import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LpNewPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 연결 로직 (예: mutation.mutate({ title, description }))
    console.log("새 LP 등록:", { title, description });
    alert("새로운 LP가 등록되었습니다.");
    navigate("/"); // 등록 후 목록으로 이동
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      {/* 헤더 섹션 */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition"
        >
          ← 뒤로가기
        </button>
        <h1 className="text-2xl font-bold text-white">새 LP 등록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 썸네일 업로드 영역 (플레이스홀더) */}
        <div className="aspect-square w-full max-w-xs mx-auto bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition">
          <span className="text-4xl text-gray-500 mb-2">+</span>
          <span className="text-sm text-gray-400">커버 이미지 업로드</span>
        </div>

        {/* 입력 필드 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="앨범 또는 곡 제목을 입력하세요"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e11d48] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="음악에 대한 짧은 감상을 남겨주세요"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e11d48] transition resize-none"
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 rounded-lg bg-white/5 text-white hover:bg-white/10 transition"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-lg bg-[#e11d48] text-white font-semibold hover:bg-[#be123c] transition shadow-[0_0_15px_rgba(225,29,72,0.3)]"
          >
            LP 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default LpNewPage;
