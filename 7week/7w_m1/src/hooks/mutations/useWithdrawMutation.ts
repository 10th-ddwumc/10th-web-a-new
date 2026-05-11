import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteMe } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";

function useWithdrawMutation() {
    const navigate = useNavigate();
    const { clearAuth } = useAuth();

    return useMutation({
        mutationFn: deleteMe,

        //  탈퇴 성공 시 토큰 제거 후 로그인 페이지로 이동
        onSuccess: () => {
            clearAuth();
            alert("탈퇴가 완료되었습니다.");
            navigate("/login", { replace: true });
        },

        onError: (error) => {
            console.error("탈퇴 실패:", error);
            alert("탈퇴 처리 중 오류가 발생했습니다.");
        },
    });
}

export default useWithdrawMutation;