import { useState, useEffect } from "react";

/**
 * 값 지연형 useDebounce 훅
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms), 기본값 300ms
 * @returns 지연된 값
 */
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay ms 후에 값을 업데이트하는 타이머 설정
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value 또는 delay가 변경되거나 언마운트 시 타이머 정리
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // delay 변경도 즉시 반영

  return debouncedValue;
}

export default useDebounce;