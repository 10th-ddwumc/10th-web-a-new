import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

function useDeleteComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteComment,

        // 댓글 삭제 성공 시 댓글 목록 새로고침
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, String(lpId)],
            });
        },

        onError: (error) => {
            console.error("댓글 삭제 실패:", error);
            alert("댓글 삭제에 실패했습니다.");
        },
    });
}

export default useDeleteComment;