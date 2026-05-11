import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { postSignin } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { RequestSigninDto } from "../../types/auth";

function useSignin(from: string = "/") {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    return useMutation({
        mutationFn: (body: RequestSigninDto) => postSignin(body),

        // 로그인 성공 시 토큰 저장 후 홈 화면으로 이동
        onSuccess: (response) => {
            setAuth(response.data);
            alert("로그인 성공");
            navigate(from, { replace: true });
        },

        onError: (error) => {
            console.error("로그인 실패:", error);
            alert("로그인 실패");
        },
    });
}

export default useSignin;