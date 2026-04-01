import { useEffect, useState } from "react";

export default function useCustomFetch<T>(
  fetchFn: () => Promise<T>,
  deps: any[],
) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const result = await fetchFn();
        setData(result);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, deps); // ✅ 의존성 바뀌면 자동 재요청

  return { data, isPending, isError };
}
