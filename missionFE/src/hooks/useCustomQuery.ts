import { useState, useEffect, useRef } from "react";

const cache = new Map<string, { data: unknown; timestamp: number }>();

interface UseCustomQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  staleTime?: number;
  retry?: number;
}

function useCustomQuery<T>({
  queryKey,
  queryFn,
  staleTime = 0,
  retry = 1,
}: UseCustomQueryOptions<T>) {
  const key = queryKey.join("-");
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const retryCount = useRef(0);
  const queryFnRef = useRef(queryFn);
  
  queryFnRef.current = queryFn; 

  useEffect(() => {
    let cancelled = false;
    retryCount.current = 0;

    const fetchData = async () => {
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
          if (!cancelled) {
            cache.set(key, { data: result, timestamp: Date.now() });
            setData(result);
            setIsLoading(false);
          }
          return;
        } catch (err) {
          retryCount.current += 1;
          console.log(`재시도 중... (${retryCount.current}/${retry})`);
          if (retryCount.current > retry) {
            if (!cancelled) {
              setIsError(true);
              setError(err as Error);
              setIsLoading(false);
            }
            return;
          }
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [key, staleTime, retry]);

  return { data, isLoading, isError, error };
}

export default useCustomQuery;