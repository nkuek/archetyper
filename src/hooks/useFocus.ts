import { WordContext } from 'providers';
import { useContext } from 'react';

const useFocus = () => {
  const { textFieldRef, setFocused } = useContext(WordContext);

  return () => {
    if (!textFieldRef.current) return;
    textFieldRef.current.focus();
    setFocused(true);
  };
};

export default useFocus;
