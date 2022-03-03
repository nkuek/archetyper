import { useEffect, useState } from 'react';

export const getSavedValue = <T>(key: string, initialValue: T) => {
  try {
    const savedValue =
      localStorage.getItem(key) && JSON.parse(localStorage.getItem(key) || '');
    if (savedValue) {
      // in case there are any new keys added that aren't in user's local storage, check and add here to prevent errors
      if (
        typeof savedValue === 'object' &&
        !Object.keys(initialValue).every((key) => savedValue[key])
      ) {
        return { ...initialValue, ...savedValue };
      }
      return savedValue;
    }
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
  } catch {
    return initialValue;
  }
};

const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const [value, setValue] = useState(() => getSavedValue(key, defaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
