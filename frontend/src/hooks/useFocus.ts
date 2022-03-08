import { SettingsContext, WordContext } from 'providers';
import { useCallback, useContext } from 'react';

const useFocus = () => {
  const { textFieldRef } = useContext(WordContext);
  const { setFocused } = useContext(SettingsContext);

  return useCallback(() => {
    if (!textFieldRef.current) return;
    textFieldRef.current.focus();
    setFocused(true);
  }, [textFieldRef, setFocused]);
};

export default useFocus;
