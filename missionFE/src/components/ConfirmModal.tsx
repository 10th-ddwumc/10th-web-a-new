// ✅ 범용 확인 모달 — LP 삭제, 회원탈퇴 등 재사용
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean; // true면 확인 버튼 빨간색
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  danger = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm bg-[#0a0a0a] rounded-3xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-black text-white">{title}</h2>
        {description && <p className="text-sm text-gray-400">{description}</p>}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#1a1a1a] text-white font-bold rounded-2xl hover:bg-gray-800 transition-all border border-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-3 text-white font-bold rounded-2xl transition-all disabled:opacity-50 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-[#ff007a] hover:bg-[#e6006e]'
            }`}
          >
            {isPending ? '처리 중...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;