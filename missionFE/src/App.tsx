import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import LPListPage from './pages/LPListPage';
import LPDetailPage from './pages/LPDetailPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage';
import LPCreatePage from './pages/LPCreatePage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/lp" element={<LPListPage />} />
        <Route path="/lp/:id" element={<LPDetailPage />} />
        <Route path="/v1/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/lp/create" element={<LPCreatePage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;