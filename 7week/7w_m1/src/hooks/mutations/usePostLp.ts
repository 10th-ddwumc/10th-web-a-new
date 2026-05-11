import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";
import type { RequestCreateLpDto } from "../../types/lp";

function usePostLp() {
    const queryClient = useQueryClient();

    return useMutation({
        //  mutationFn이 body를 받는 함수라는 것을 명확하게 지정
        mutationFn: (body: RequestCreateLpDto) => postLp(body),

        //  LP 생성 성공 시 메인 LP 목록 새로고침
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
        },

        onError: (error) => {
            console.error("LP 생성 실패:", error);
            alert("LP 생성에 실패했습니다.");
        },
    });
}

export default usePostLp;