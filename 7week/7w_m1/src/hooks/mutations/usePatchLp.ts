import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLp } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";

function usePatchLp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchLp,

        // LP 수정 성공 시 상세 페이지와 목록을 모두 새로고침
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, variables.lpid],
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
        },

        onError: (error) => {
            console.error("LP 수정 실패:", error);
            alert("LP 수정에 실패했습니다.");
        },
    });
}

export default usePatchLp;