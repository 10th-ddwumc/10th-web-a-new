//src/components/LpCreateModal

import { useState, useEffect, useRef } from 'react';

export interface LpFormData {
  title: string;
  content: string;
  tags: string[];
  thumbnail: File | null;
}

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LpFormData) => void;
  isLoading?: boolean;
}

const LpCreateModal = ({ isOpen, onClose, onSubmit, isLoading = false }: LpCreateModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // 미리보기 URL 생성/해제
  useEffect(() => {
    if (!thumbnail) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(thumbnail);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnail]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setTitle(''); setContent(''); setTagInput(''); setTags([]);
      setThumbnail(null); setPreviewUrl(null);
    }, 250);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    setThumbnail(file);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t]);
      setTagInput('');
      tagInputRef.current?.focus();
    }
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0)
      setTags(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!title.trim() || isLoading) return;
    onSubmit({ title: title.trim(), content: content.trim(), tags, thumbnail });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
    >
      <div
        className="relative w-full max-w-md bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
          transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
          opacity: visible ? 1 : 0,
        }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all z-10"
        >
          ✕
        </button>

        {/* 숨겨진 file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 레코드 이미지 클릭 영역 */}
        <div className="flex flex-col justify-center items-center py-8 bg-[#111] gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group rounded-full overflow-hidden focus:outline-none"
            title="클릭해서 사진 첨부"
          >
            {/* 미리보기 or 기본 레코드 SVG */}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="썸네일 미리보기"
                className="w-[110px] h-[110px] rounded-full object-cover"
              />
            ) : (
              <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
                <circle cx="55" cy="55" r="53" fill="#1a1a1a" />
                {[48, 40, 32, 24, 16].map(r => (
                  <circle key={r} cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                ))}
                <circle cx="55" cy="55" r="16" fill="#2a2a2a" />
                <circle cx="55" cy="55" r="4" fill="#0a0a0a" />
                <ellipse cx="38" cy="36" rx="10" ry="5" fill="rgba(255,255,255,0.04)" transform="rotate(-30 38 36)" />
              </svg>
            )}

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <span className="text-white text-xl">📷</span>
              <span className="text-white text-[10px] font-medium">사진 첨부</span>
            </div>
          </button>

          {/* 파일명 표시 */}
          {thumbnail ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 max-w-[200px] truncate">{thumbnail.name}</span>
              <button
                onClick={() => { setThumbnail(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-xs text-gray-600 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="text-xs text-gray-600">클릭해서 사진 첨부</span>
          )}
        </div>

        {/* 폼 */}
        <div className="px-6 pb-6 space-y-3">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none placeholder:text-gray-600 text-white text-sm transition-colors"
          />
          <textarea
            placeholder="LP Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            className="w-full p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none placeholder:text-gray-600 text-white text-sm resize-none transition-colors"
          />
          <div className="flex gap-2">
            <input
              ref={tagInputRef}
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              maxLength={30}
              className="flex-1 p-4 bg-[#141414] border border-gray-800 rounded-2xl focus:border-[#ff007a] outline-none placeholder:text-gray-600 text-white text-sm transition-colors"
            />
            <button
              onClick={addTag}
              disabled={!tagInput.trim()}
              className="px-5 rounded-2xl bg-[#ff007a] text-white font-bold text-sm hover:bg-[#e6006e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ff007a]/10 border border-[#ff007a]/30 text-[#ff007a] text-xs font-medium"
                >
                  #{tag}
                  <button
                    onClick={() => setTags(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-[#ff007a]/60 hover:text-[#ff007a] transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="w-full py-4 bg-[#ff007a] text-white font-bold rounded-2xl hover:bg-[#e6006e] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '저장 중...' : 'Add LP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpCreateModal;