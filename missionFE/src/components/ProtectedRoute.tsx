import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('accessToken');
  const location = useLocation();

  if (!token) {
    // 토큰 없으면 로그인 페이지로 보내고, 원래 가려던 주소(from)를 기억시킵니다.
    alert("로그인이 필요한 페이지입니다.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 토큰 있으면 해당 페이지(자식) 보여주기
  return <Outlet />;
};

export default ProtectedRoute;