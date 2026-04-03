import { NavLink } from "react-router-dom"

const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: '/movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '평점 높은' },
    { to: '/movies/upcoming', label: '개봉 예정' },
]

export const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 w-full bg-white px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-6">
                {LINKS.map(({ to, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => {
                            return `text-sm font-bold transition-colors ${isActive ? 'text-[#b2dab1]' : 'text-gray-500 hover:text-gray-800'
                                }`
                        }}
                    >
                        {label}
                    </NavLink>
                ))}
            </div>

            <div className="absolute left-0 top-full w-full h-5 bg-gradient-to-b from-white to-transparent pointer-events-none opacity-80" />
        </nav>
    )
}