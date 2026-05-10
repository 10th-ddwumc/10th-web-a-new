import { useState, useEffect, useRef, useCallback } from "react";
export { cache };
const cache = new Map<string, { data: unknown; timestamp: number }>();

interface UseCustomQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  gcTime?: number; // ✅ gcTime 추가
  retry?: number;
  enabled?: boolean;
}

function useCustomQuery<T>({
  queryKey,
  queryFn,
  staleTime = 0,
  gcTime = 1000 * 60 * 5, 
  retry = 1,
  enabled = true,
}: UseCustomQueryOptions<T>) {
  const key = queryKey.join("-");
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const retryCount = useRef(0);
  const queryFnRef = useRef(queryFn);

  queryFnRef.current = queryFn;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    retryCount.current = 0;

    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data as T);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    while (retryCount.current <= retry) {
      try {
        const result = await queryFnRef.current();
        cache.set(key, { data: result, timestamp: Date.now() });
        setData(result);
        setIsLoading(false);
        return;
      } catch (err) {
        retryCount.current += 1;
        console.log(`재시도 중... (${retryCount.current}/${retry})`);
        if (retryCount.current > retry) {
          setIsError(true);
          setError(err as Error);
          setIsLoading(false);
          return;
        }
      }
    }
  }, [key, staleTime, retry, enabled]);

  useEffect(() => {
    fetchData();

    // ✅ gcTime 후 캐시 삭제
    const gcTimer = setTimeout(() => {
      cache.delete(key);
      console.log(`캐시 삭제됨: ${key}`);
    }, gcTime);

    return () => {
      clearTimeout(gcTimer);
    };
  }, [fetchData, gcTime, key]);

  return { data, isLoading, isError, error, refetch: fetchData };
}

export default useCustomQuery;