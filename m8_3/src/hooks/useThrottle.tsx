import { useRef } from "react";

export const useThrottle = <T extends (...args: any[]) => void>(callback: T, interval: number) => {
  const lastRun = useRef(0);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun.current >= interval) {
      lastRun.current = now;
      callback(...args);
    }
  };
};