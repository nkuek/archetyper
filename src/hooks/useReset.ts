import { WordContext, ThemeContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { defaultWordBoxConfig } from 'providers/WordProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const { setWordList, setAuthor } = useContext(WordListContext);
  const {
    wordRef,
    textFieldRef,
    timer,
    setTimer,
    setWpm,
    setWpmData,
    setUserInput,
    setInputHistory,
    settings,
    wordBoxConfig,
    setWordBoxConfig,
  } = useContext(WordContext);

  const { classes } = useContext(ThemeContext);
  const { getQuote } = useQuote();

  return useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      const { currentCharIndex, currentWordIndex } = wordBoxConfig;
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
      if ((!timer.id && !currentWordIndex && !currentCharIndex) || randomize) {
        if (settings.quotes) {
          getQuote();
        } else {
          setWordList(randomizeWords(settings));
          setAuthor(null);
        }
      }
      setUserInput('');
      setInputHistory([]);
      setWordBoxConfig(defaultWordBoxConfig);
      setWpm({ gross: 0, raw: 0 });
      setWpmData([]);
      if (timer.id) {
        clearInterval(timer.id);
        setTimer({ id: null, time: 1 });
      }
    },
    [
      wordRef,
      textFieldRef,
      setWordList,
      classes,
      timer,
      setTimer,
      setWpm,
      setWpmData,
      setUserInput,
      randomize,
      settings,
      getQuote,
      setAuthor,
      setInputHistory,
      wordBoxConfig,
      setWordBoxConfig,
    ]
  );
};

export default useReset;
