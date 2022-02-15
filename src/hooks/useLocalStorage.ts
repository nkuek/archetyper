import { useCallback, useMemo } from 'react';

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const getValue: () => T = useCallback(() => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) || '')
      : defaultValue;
  }, [key, defaultValue]);

  const setLocalStorage = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key]
  );

  return useMemo(
    () => ({ value: getValue(), setLocalStorage }),
    [getValue, setLocalStorage]
  );
};

export default useLocalStorage;
