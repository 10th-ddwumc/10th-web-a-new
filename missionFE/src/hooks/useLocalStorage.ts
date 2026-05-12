import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // ✅ 다른 컴포넌트에서 같은 key를 변경하면 여기도 업데이트
  useEffect(() => {
    const handleStorage = (e: StorageEvent | CustomEvent) => {
      // CustomEvent(같은 탭)과 StorageEvent(다른 탭) 모두 처리
      const storageKey = (e as StorageEvent).key ?? (e as CustomEvent).detail?.key;
      if (storageKey !== key) return;
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage-change', handleStorage as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage-change', handleStorage as EventListener);
    };
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // ✅ 같은 탭의 다른 컴포넌트에게 변경 알림
      window.dispatchEvent(new CustomEvent('local-storage-change', {
        detail: { key },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;