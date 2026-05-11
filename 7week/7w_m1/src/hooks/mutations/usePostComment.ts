import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

function usePostComment(lpId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postComment,

        //  댓글 작성 성공 시 댓글 목록 새로고침
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.comments, String(lpId)],
            });
        },

        onError: (error) => {
            console.error("댓글 작성 실패:", error);
            alert("댓글 작성에 실패했습니다.");
        },
    });
}

export default usePostComment;