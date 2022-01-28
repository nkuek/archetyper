import useStyles from 'components/WordBox/styles';
import { WordContext, ThemeContext } from 'providers';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';

const useReset = () => {
  const { theme } = useContext(ThemeContext);

  const classes = useStyles({ theme });

  const {
    wordRef,
    textFieldRef,
    setWordList,
    userInput,
    currentWordIndex,
    currentCharIndex,
    setTimerId,
    timerId,
    setTimer,
    setWpm,
    setWpmData,
    setCharCount,
    setCurrentCharIndex,
    setCurrentWordIndex,
    setIncorrectChars,
    setUserInput,
  } = useContext(WordContext);

  return useCallback(() => {
    if (wordRef.current && textFieldRef.current) {
      if (!userInput && !currentWordIndex && !currentCharIndex) {
        setWordList(randomizeWords());
      } else {
        const words = wordRef.current.children;
        const extraWords = document.querySelectorAll(`.${classes.extra}`);
        extraWords.forEach((word) => word.remove());
        for (const word of words) {
          for (const char of word.children) {
            char.classList.remove(...classes.correct.split(' '));
            char.classList.remove(...classes.incorrect.split(' '));
            char.classList.remove(...classes.currentChar.split(' '));
          }
        }
      }
      setUserInput('');
      setCurrentCharIndex(0);
      setCurrentWordIndex(0);
      setIncorrectChars(0);
      setWpm(0);
      setWpmData([]);
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
        setTimer(1);
        setCharCount(0);
      }
    }
    document.getElementsByTagName('input')[0].focus();
  }, [
    wordRef,
    textFieldRef,
    setWordList,
    userInput,
    currentWordIndex,
    currentCharIndex,
    classes,
    setTimerId,
    timerId,
    setTimer,
    setWpm,
    setWpmData,
    setCharCount,
    setCurrentCharIndex,
    setCurrentWordIndex,
    setIncorrectChars,
    setUserInput,
  ]);
};

export default useReset;
