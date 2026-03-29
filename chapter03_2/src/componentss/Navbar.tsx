import { NavLink } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

const LINKS = [
    { to: '/', label: 'HOME'},
    { to: '/movies/popular', label: ' 인기 영화 '},
    { to: '/movies/now_playing', label: ' 상영중 '},
    { to: '/movies/top_rated', label: ' 평점 높은 '},
    { to: '/movies/upcoming', label: ' 개봉 예정 '},

]

export const Navbar = (): JSX.Element=> {
    return (
        <div className="flex gap-3 p-4">
    {LINKS.map(({to,label}): JSX.Element => (
        <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
            isActive ? 'text-[#635f58] font-bold' : 'text-gray-800'
        }
        >
            {label}
        </NavLink>
    ))}
    </div>
  );
};