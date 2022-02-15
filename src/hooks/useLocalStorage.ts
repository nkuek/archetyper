const useLocalStorage = <T>(key: string, defaultValue?: T) => {
  const getValue = () => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) || '')
      : defaultValue;
  };

  const setLocalStorage = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return { value: getValue(), setLocalStorage };
};

export default useLocalStorage;
