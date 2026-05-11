import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

const Sidebar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { mutate: withdrawMutate } = useMutation({
        mutationFn: () => axiosInstance.delete("v1/users"),
        onSuccess: () => {
            alert("탈퇴가 완료되었습니다.");
            localStorage.clear();
            window.location.href = "/login";
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.");
        }
    });

    const handleWithdrawClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        withdrawMutate();
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleWithdrawClick}>탈퇴하기</button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 w-80">
                        <h2 className="text-xl font-bold text-white mb-4">회원 탈퇴</h2>
                        <p className="text-zinc-400 mb-6">정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleConfirm}
                                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                예
                            </button>
                            <button 
                                onClick={handleCancel}
                                className="flex-1 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;