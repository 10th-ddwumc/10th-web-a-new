import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedLayout = () => {
    const { accessToken } = useAuth();
    const location = useLocation();

    //location: 사용자가 로그인하지 않은 상태에서 인증이 필요한 페이지에 접근하려고 할 때, 로그인 페이지로 리다이렉트하면서 원래 가려고 했던 페이지의 경로를 상태로 전달하는 역할
    if (!accessToken) {
        return <Navigate to={"/login"} state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export default ProtectedLayout;