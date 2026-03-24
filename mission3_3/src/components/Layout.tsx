import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>
      
      <footer className="py-8 text-center text-gray-400 text-sm border-t mt-20">
        © 2026 유요미 Movie. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;