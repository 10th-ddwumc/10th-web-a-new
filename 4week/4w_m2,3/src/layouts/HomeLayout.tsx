import { Outlet, Link } from "react-router-dom";
const HomeLayout = () => {
    return (
        <div className="h-dvh flex flex-col">
            <nav className="flex justify-between items-center p-4 bg-white shadow-sm">
                <Link to="/" className="text-2xl font-bold text-[#627550] no-underline">GEGE</Link>
                <div className="flex gap-2">
                    <Link to="/login" className="px-4 py-2 bg-[#627550] text-white rounded-md no-underline">로그인</Link>
                    <Link to="/signup" className="px-4 py-2 bg-[#627550] text-white rounded-md no-underline">회원가입</Link>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="p-4 text-center text-gray-600">푸터..⭐⭐</footer>
        </div>
    )
}

export default HomeLayout;