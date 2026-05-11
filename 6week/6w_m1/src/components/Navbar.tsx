import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
    const { accessToken, userName, logout } = useAuth();

    return (
        <nav className="fixed top-0 w-full flex justify-between items-center p-4 bg-[#121212] z-[51] text-white border-b border-gray-800">
            <div className="flex items-center gap-4">
                {/* [동작 확인] 클릭 시 onToggleSidebar가 실행되어 ProtectedLayout의 isSidebarOpen 상태를 바꿉니다. */}
                <button onClick={onToggleSidebar} className="cursor-pointer hover:text-pink-500">
                    <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                    </svg>
                </button>
                <Link to="/" className="text-2xl font-bold text-pink-500 no-underline">DOLIGO</Link>
            </div>

            <div className="flex items-center gap-6">
                <button className="cursor-pointer hover:text-pink-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>

                {!accessToken ? (
                    <div className="flex gap-4 items-center">
                        <Link to="/login" className="hover:text-pink-500">로그인</Link>
                        <Link to="/signup" className="px-4 py-1 bg-pink-500 text-white rounded-md font-bold">회원가입</Link>
                    </div>
                ) : (
                    <div className="flex gap-4 items-center">
                        <span className="text-sm font-medium">{userName}님 반갑습니다.</span>
                        <button onClick={logout} className="hover:text-pink-500 cursor-pointer">로그아웃</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;