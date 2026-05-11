import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLike } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";
import type {
    Like,
    RequestLpDto,
    ResponseLikeLpDto,
    ResponseLpDto,
} from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

type OptimisticContext = {
    previousLpPost?: ResponseLpDto;
};

function usePostLike() {
    const queryClient = useQueryClient();

    return useMutation<
        ResponseLikeLpDto,
        Error,
        RequestLpDto,
        OptimisticContext
    >({
        mutationFn: postLike,

        // 수정: API 요청 전에 먼저 캐시 데이터를 바꿔서 UI에 바로 반영
        onMutate: async (lp: RequestLpDto) => {
            // 1. 현재 LP 상세 데이터에 대한 쿼리 취소
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEY.lps, lp.lpid],
            });

            // 2. 기존 LP 상세 데이터를 캐시에서 가져오기
            const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
                QUERY_KEY.lps,
                lp.lpid,
            ]);

            // 3. 현재 로그인한 유저 정보 가져오기
            const me = queryClient.getQueryData<ResponseMyInfoDto>([
                QUERY_KEY.myInfo,
            ]);

            const userId = Number(me?.data?.id);

            // 기존 LP 데이터나 내 정보가 없으면 롤백용 데이터만 반환
            if (!previousLpPost || Number.isNaN(userId)) {
                return { previousLpPost };
            }

            // 4. 이미 내가 좋아요를 눌렀는지 확인
            const likedIndex = previousLpPost.data.likes.findIndex(
                (like) => like.userId === userId,
            );

            let newLikes: Like[];

            // 5. 좋아요가 없을 때만 새 좋아요 추가
            if (likedIndex === -1) {
                const newLike = {
                    id: Date.now(),
                    userId,
                    lpId: lp.lpid,
                } as Like;

                newLikes = [...previousLpPost.data.likes, newLike];
            } else {
                newLikes = previousLpPost.data.likes;
            }

            // 6. 기존 게시글 데이터를 복사해서 likes만 새 배열로 교체
            const newLpPost: ResponseLpDto = {
                ...previousLpPost,
                data: {
                    ...previousLpPost.data,
                    likes: newLikes,
                },
            };

            // 7. 캐시에 바로 저장해서 UI 즉시 변경
            queryClient.setQueryData([QUERY_KEY.lps, lp.lpid], newLpPost);

            // 8. 실패했을 때 되돌리기 위해 이전 데이터 반환
            return { previousLpPost };
        },

        // 수정: API 요청 실패 시 이전 캐시 데이터로 롤백
        onError: (_error, variables, context) => {
            if (!context?.previousLpPost) return;

            queryClient.setQueryData(
                [QUERY_KEY.lps, variables.lpid],
                context.previousLpPost,
            );
        },

        // 수정: 성공/실패 상관없이 서버 데이터와 다시 동기화
        onSettled: async (_data, _error, variables) => {
            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, variables.lpid],
            });

            await queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
        },
    });
}

export default usePostLike;