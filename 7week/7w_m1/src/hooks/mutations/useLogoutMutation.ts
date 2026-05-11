import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

function useLogoutMutation() {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();

    return useMutation({
        mutationFn: postLogout,

        // 로그아웃 성공 시 토큰 제거 후 로그인 페이지로 이동
        onSuccess: () => {
            clearAuth();
            alert("로그아웃 되었습니다.");
            navigate("/login", { replace: true });
        },

        //  서버 로그아웃 요청이 실패해도 프론트 토큰은 제거해서 사용자 입장에서는 로그아웃되도록 처리
        onError: (error) => {
            console.error("로그아웃 에러:", error);
            clearAuth();
            navigate("/login", { replace: true });
        },
    });
}

export default useLogoutMutation;