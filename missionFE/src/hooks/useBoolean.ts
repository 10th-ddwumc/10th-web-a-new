import { useState, useCallback } from "react";

/**
 * boolean 상태를 간편하게 관리하는 훅
 * 모달 open/close 등에 활용
 */
export function useBoolean(initial = false) {
  const [value, setValue] = useState(initial);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((v) => !v), []);

  return { value, setTrue, setFalse, toggle };
}