import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteLp } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLp() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: deleteLp,

        // LP 삭제 성공 시 목록 새로고침 후 홈으로 이동
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });

            navigate("/");
        },

        onError: (error) => {
            console.error("LP 삭제 실패:", error);
            alert("LP 삭제에 실패했습니다.");
        },
    });
}

export default useDeleteLp;