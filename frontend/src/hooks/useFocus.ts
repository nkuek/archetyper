import { SettingsContext, WordContext } from 'providers';
import { useContext } from 'react';

const useFocus = () => {
  const { textFieldRef } = useContext(WordContext);
  const { setFocused } = useContext(SettingsContext);

  return () => {
    if (!textFieldRef.current) return;
    textFieldRef.current.focus();
    setFocused(true);
  };
};

export default useFocus;
