import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLike } from "../../apis/ip";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteLike,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps, variables.lpid],
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.lps],
            });
        },
    });
}

export default useDeleteLike;