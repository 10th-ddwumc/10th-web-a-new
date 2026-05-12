// src/hooks/useFetch.ts
import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setIsError(true);
          setError(err as Error);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, isLoading, isError, error };
}

export default useFetch;