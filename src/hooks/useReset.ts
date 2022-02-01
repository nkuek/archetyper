import { WordContext, ThemeContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';

const useReset = (randomize = true) => {
  const { setWordList } = useContext(WordListContext);
  const {
    wordRef,
    textFieldRef,
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
    setFocused,
    settings,
  } = useContext(WordContext);

  const { classes } = useContext(ThemeContext);
  const { getQuote };

  return useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      if (wordRef.current && textFieldRef.current) {
        if (!userInput && !currentWordIndex && !currentCharIndex && randomize) {
          setWordList(randomizeWords(settings));
        } else {
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
      randomize,
      setFocused,
      settings,
    ]
  );
};

export default useReset;
