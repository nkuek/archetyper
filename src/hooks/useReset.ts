import { WordContext, ThemeContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const { setWordList, setAuthor } = useContext(WordListContext);
  const {
    wordRef,
    textFieldRef,
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
    setFocused,
    settings,
  } = useContext(WordContext);

  const { classes } = useContext(ThemeContext);
  const { getQuote } = useQuote();

  return useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      if (wordRef.current && textFieldRef.current) {
        const words = wordRef.current.children;
        const extraWords = document.querySelectorAll(`.${classes.extra}`);
        extraWords.forEach((word) => word.remove());
        for (let i = 0; i <= currentWordIndex; i++) {
          const word = words[i];
          for (const char of word.children) {
            char.classList.remove(
              ...classes.correct.split(' '),
              ...classes.incorrect.split(' '),
              ...classes.currentChar.split(' '),
              classes.animation
            );
          }
        }
        wordRef.current.children[0]?.scrollIntoView({
          block: 'center',
        });
      }
      if ((!timerId && !currentWordIndex && !currentCharIndex) || randomize) {
        if (settings.quotes) {
          getQuote();
        } else {
          setWordList(randomizeWords(settings));
          setAuthor(null);
        }
      }
      setUserInput('');
      setCurrentCharIndex(0);
      setCurrentWordIndex(0);
      setIncorrectChars(0);
      setWpm(0);
      setWpmData([]);
      setFocused(true);
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
        setTimer(1);
        setCharCount(0);
      }
    },
    [
      wordRef,
      textFieldRef,
      setWordList,
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
      randomize,
      setFocused,
      settings,
      getQuote,
    ]
  );
};

export default useReset;
