import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions<T> {
  queryKey: string[];
  queryFn: (cursor: number) => Promise<{ data: T[]; nextCursor: number | null; hasNext: boolean }>;
  staleTime?: number;
  enabled?: boolean;
}

function useInfiniteScroll<T>({
  queryKey,
  queryFn,
  staleTime = 0,
  enabled = true,
}: UseInfiniteScrollOptions<T>) {
  const key = queryKey.join("-");
  const [pages, setPages] = useState<T[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(0);
  const isFetchingRef = useRef(false); // ✅ ref로 관리

  const fetchFirstPage = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setIsError(false);
    setPages([]);
    setNextCursor(0);
    isFetchingRef.current = false;

    try {
      const result = await queryFn(0);
      setPages([result.data]);
      setHasNextPage(result.hasNext);
      setNextCursor(result.nextCursor);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [key,enabled]);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || nextCursor === null || isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsFetchingNextPage(true);
    try {
      const result = await queryFn(nextCursor);
      setPages(prev => [...prev, result.data]);
      setHasNextPage(result.hasNext);
      setNextCursor(result.nextCursor);
    } catch {
      setIsError(true);
    } finally {
      isFetchingRef.current = false;
      setIsFetchingNextPage(false);
    }
  }, [hasNextPage, nextCursor, key]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  // ✅ 중복 제거하면서 flat
  const data = pages.flat().filter((item, index, self) =>
    index === self.findIndex((t) => (t as any).id === (item as any).id)
  );

  return {
    data,
    isLoading,
    isFetchingNextPage,
    isError,
    hasNextPage,
    fetchNextPage,
    refetch: fetchFirstPage,
  };
}

export default useInfiniteScroll;