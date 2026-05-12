import { useState, useEffect, useRef } from "react";

/**
 * 값 조절형 useThrottle 훅
 * @param value - 쓰로틀할 값
 * @param interval - 최소 실행 간격 (ms), 기본값 300ms
 * @returns 쓰로틀된 값
 */
function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0); // 마지막으로 값이 업데이트된 시각
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 타이머 ref

  useEffect(() => {
    const now = Date.now();
    const remaining = interval - (now - lastUpdated.current);

    if (remaining <= 0) {
      // interval이 지났으면 즉시 업데이트
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // interval이 안 지났으면 남은 시간 후에 마지막 값으로 업데이트
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
        timerRef.current = null;
      }, remaining);
    }

    // 언마운트 또는 의존성 변경 시 타이머 정리
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;