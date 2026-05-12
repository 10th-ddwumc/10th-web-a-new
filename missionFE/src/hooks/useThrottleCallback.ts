import { useCallback, useRef, useEffect } from "react";

/**
 * 콜백형 useThrottle 훅
 * @param callback - 쓰로틀할 함수
 * @param interval - 최소 실행 간격 (ms), 기본값 300ms
 * @returns 쓰로틀된 함수
 */
function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 300
): (...args: Parameters<T>) => void {
  const lastCalledRef = useRef<number>(0); // 마지막 실행 시각
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef<T>(callback);

  // 항상 최신 callback을 참조
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = interval - (now - lastCalledRef.current);

      if (remaining <= 0) {
        // interval이 지났으면 즉시 실행
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastCalledRef.current = now;
        callbackRef.current(...args);
      } else {
        // interval이 안 지났으면 남은 시간 후 실행
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          lastCalledRef.current = Date.now();
          callbackRef.current(...args);
          timerRef.current = null;
        }, remaining);
      }
    },
    [interval]
  );
}

export default useThrottleCallback;