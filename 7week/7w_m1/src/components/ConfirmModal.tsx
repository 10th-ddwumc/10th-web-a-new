interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
    isPending?: boolean;
}

const ConfirmModal = ({
    isOpen,
    title,
    confirmText = "예",
    cancelText = "아니오",
    onConfirm,
    onClose,
    isPending = false,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
            onClick={onClose}
        >
            <div
                className="relative w-[520px] max-w-[90vw] rounded-xl bg-[#2A2D34] px-20 py-24 text-white"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 text-3xl text-white hover:text-pink-500"
                >
                    ×
                </button>

                <p className="mb-14 text-center text-2xl font-bold">
                    {title}
                </p>

                <div className="flex justify-center gap-12">
                    <button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="w-32 rounded-xl bg-gray-200 py-3 text-lg font-bold text-black disabled:opacity-60"
                    >
                        {isPending ? "처리중" : confirmText}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-32 rounded-xl bg-pink-500 py-3 text-lg font-bold text-white disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;