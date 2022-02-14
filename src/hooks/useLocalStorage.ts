import { useCallback, useMemo } from 'react';

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const getValue: () => T = () => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) || '')
      : defaultValue;
  };

  const setLocalStorage = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return useMemo(
    () => ({ value: getValue(), setLocalStorage }),
    [getValue, setLocalStorage]
  );
};

export default useLocalStorage;
