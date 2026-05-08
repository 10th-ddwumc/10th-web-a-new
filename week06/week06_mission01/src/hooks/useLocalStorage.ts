export const useLocalStorage = <T>(key: string) => {
  const setItem = (value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const getItem = (): T | null => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) {
        return null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const removeItem = (): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  };

  return { setItem, getItem, removeItem };
};
