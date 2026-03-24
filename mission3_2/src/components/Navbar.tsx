import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = "text-orange-500 font-bold border-b-2 border-orange-500 pb-1";
  const defaultStyle = "text-gray-600 hover:text-orange-400 transition-all";

  return (
    <nav className="flex items-center gap-8 p-6 bg-white shadow-sm sticky top-0 z-50">
      <NavLink to="/" className="text-2xl font-black text-orange-600 mr-4">유요미 Movie</NavLink>
      
      <div className="flex gap-6">
        <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>홈</NavLink>
        <NavLink to="/movies" className={({ isActive }) => isActive ? activeStyle : defaultStyle}>인기 영화</NavLink>

        <button className={defaultStyle}>개봉 예정</button>
        <button className={defaultStyle}>평점 높은</button>
      </div>
    </nav>
  );
};

export default Navbar;