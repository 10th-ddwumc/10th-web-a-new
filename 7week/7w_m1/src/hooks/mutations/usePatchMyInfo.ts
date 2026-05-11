import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function usePatchMyInfo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: patchMyInfo,

        // 내 정보 수정 성공 시 마이페이지 정보와 네비게이션 닉네임 새로고침
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            });

            alert("프로필이 수정되었습니다.");
        },

        onError: (error) => {
            console.error("프로필 수정 실패:", error);
            alert("프로필 수정에 실패했습니다.");
        },
    });
}

export default usePatchMyInfo;