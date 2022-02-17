import { WordContext } from 'providers';
import { useContext } from 'react';

const useFocus = () => {
  const { textFieldRef, setFocused } = useContext(WordContext);

  return () => {
    if (!textFieldRef.current) return;
    setTimeout(() => {
      textFieldRef.current!.focus();
      setFocused(true);
    }, 1);
  };
};

export default useFocus;
