import { useEffect, useState } from 'react';

export const getSavedValue = <T>(key: string, initialValue: T) => {
  const savedValue =
    localStorage.getItem(key) && JSON.parse(localStorage.getItem(key) || '');
  if (savedValue) return savedValue;
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
};

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const [value, setValue] = useState(() => getSavedValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
