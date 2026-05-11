import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import AddLpModal from "../components/AddLpModal";
import ConfirmModal from "../components/ConfirmModal";
import useWithdrawMutation from "../hooks/mutations/useWithdrawMutation";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();

    // [기존 유지] 초기값을 true로 설정하면 큰 화면에서 처음부터 사이드바가 보입니다.
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 수정: 우측 하단 + 버튼 클릭 시 LP 작성 모달을 띄우기 위한 상태
    const [isAddLpModalOpen, setIsAddLpModalOpen] = useState(false);

    // 수정: 탈퇴하기 확인 모달 상태
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const { mutate: withdrawMutate, isPending: isWithdrawPending } =
        useWithdrawMutation();

    useEffect(() => {
        if (!accessToken) {
            alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
        }
    }, [accessToken]);

    if (!accessToken) {
        return <Navigate to={"/login"} state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-white">
            {/* 헤더 */}
            <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex flex-1 pt-16">
                {/* [수정] 사이드바 */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 pt-16
                        w-64 bg-[#121212] border-r border-gray-800 transition-transform duration-300
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    `}
                >
                    <div className="flex flex-col h-full p-6">
                        <nav className="flex flex-col gap-6 mt-4">
                            <button
                                onClick={() => (window.location.href = "/search")}
                                className="flex items-center gap-3 text-lg hover:text-pink-500 text-left cursor-pointer"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                    ></line>
                                </svg>
                                찾기
                            </button>

                            <button
                                onClick={() => (window.location.href = "/mypage")}
                                className="flex items-center gap-3 text-lg hover:text-pink-500 text-left cursor-pointer"
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                마이페이지
                            </button>
                        </nav>

                        <button
                            // 수정: 탈퇴하기 클릭 시 바로 탈퇴하지 않고 확인 모달 열기
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="mt-auto text-gray-500 hover:text-white text-left cursor-pointer"
                        >
                            탈퇴하기
                        </button>
                    </div>
                </aside>

                {/* [수정] 사이드바 외부 영역 클릭 시 닫기 */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* [수정] 메인 콘텐츠 */}
                <main
                    className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "lg:pl-64" : "pl-0"
                        }`}
                >
                    <div className="p-4">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>

            {/* 수정: 우측 하단 + 버튼 */}
            {/* 중요: 여기서 /search로 이동하면 안 되고, 모달 상태만 true로 바꿔야 함 */}
            <button
                type="button"
                onClick={() => setIsAddLpModalOpen(true)}
                className="fixed bottom-10 right-10 w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition-transform z-50 cursor-pointer"
            >
                +
            </button>

            {/* 수정: LP 글 작성 모달 */}
            <AddLpModal
                isOpen={isAddLpModalOpen}
                onClose={() => setIsAddLpModalOpen(false)}
            />

            {/* 수정: 탈퇴 확인 모달 */}
            <ConfirmModal
                isOpen={isWithdrawModalOpen}
                title="정말 탈퇴하시겠습니까?"
                confirmText="예"
                cancelText="아니오"
                isPending={isWithdrawPending}
                onClose={() => setIsWithdrawModalOpen(false)}
                onConfirm={() => withdrawMutate()}
            />
        </div>
    );
};

export default ProtectedLayout;