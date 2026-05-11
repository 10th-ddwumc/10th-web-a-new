import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

function usePatchComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchComment,

        //  댓글 수정 성공 시 댓글 목록 새로고침
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, String(lpId)],
            });
        },

        onError: (error) => {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다.");
        },
    });
}

export default usePatchComment;