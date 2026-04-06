import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1400px] mx-auto py-8 px-6">
        <Outlet />
      </main>
      <footer className="py-10 text-center text-gray-400 text-sm border-t border-gray-200">
        © 2026 유요미 Movie. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;