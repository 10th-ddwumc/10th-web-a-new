import { useEffect, useState } from "react";
import { movieApi } from "../App";

type UseCustomFetchReturn<T> = {
    data: T | null;
    isPending: boolean;
    isError: boolean;
};

export default function useCustomFetch<T>(url: string): UseCustomFetchReturn<T> {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsPending(true);
            setIsError(false);

            try {
                const response = await movieApi.get<T>(url);

                if (isMounted) {
                    setData(response.data);
                }
            } catch (error) {
                console.error("데이터를 불러오는 중 오류가 발생했습니다.", error);

                if (isMounted) {
                    setIsError(true);
                }
            } finally {
                if (isMounted) {
                    setIsPending(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { data, isPending, isError };
}