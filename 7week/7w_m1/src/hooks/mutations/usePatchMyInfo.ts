import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type {
    RequestUpdateMyInfoDto,
    ResponseMyInfoDto,
    ResponseUpdateMyInfoDto,
} from "../../types/auth";
import { useAuth } from "../../context/AuthContext";

type OptimisticMyInfoContext = {
    previousMyInfo?: ResponseMyInfoDto;
    previousUserName: string | null;
};

function usePatchMyInfo() {
    const queryClient = useQueryClient();
    const { userName, updateUserName } = useAuth();

    return useMutation<
        ResponseUpdateMyInfoDto,
        Error,
        RequestUpdateMyInfoDto,
        OptimisticMyInfoContext
    >({
        mutationFn: patchMyInfo,

        // 서버 응답을 기다리기 전에 마이페이지와 Navbar 닉네임을 즉시 변경
        onMutate: async (body) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.myInfo],
            });

            const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
                QUERY_KEY.myInfo,
            ]);

            if (body.name !== undefined) {
                updateUserName(body.name);
            }

            if (previousMyInfo) {
                queryClient.setQueryData<ResponseMyInfoDto>(
                    [QUERY_KEY.myInfo],
                    {
                        ...previousMyInfo,
                        data: {
                            ...previousMyInfo.data,
                            ...body,
                        },
                    },
                );
            }

            return {
                previousMyInfo,
                previousUserName: userName,
            };
        },

        //  실패하면 이전 닉네임과 이전 마이페이지 정보로 롤백
        onError: (error, _variables, context) => {
            console.error("프로필 수정 실패:", error);

            if (context?.previousMyInfo) {
                queryClient.setQueryData(
                    [QUERY_KEY.myInfo],
                    context.previousMyInfo,
                );
            }

            updateUserName(context?.previousUserName ?? null);

            alert("프로필 수정에 실패했습니다.");
        },

        onSuccess: () => {
            alert("프로필이 수정되었습니다.");
        },

        //  성공/실패와 관계없이 서버 최신 데이터로 다시 동기화
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.myInfo],
            });
        },
    });
}

export default usePatchMyInfo;