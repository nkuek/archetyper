import { IndexContext, useSettings, useTimer, WordContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { defaultWordBoxConfig } from 'providers/WordProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';
import useFocus from './useFocus';
import useLocalStorage from './useLocalStorage';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const { wordList, setWordList, setAuthor, setErrorMessage, setWordCount } =
    useContext(WordListContext);
  const {
    setWpm,
    setWpmData,
    setUserInput,
    setInputHistory,
    setWordBoxConfig,
  } = useContext(WordContext);

  const {
    currentCharIndex,
    currentWordIndex,
    setCurrentCharIndex,
    setCurrentWordIndex,
    setUserWordIndex,
  } = useContext(IndexContext);

  const { settings } = useSettings();
  const { timer, resetTimer, defaultTimer } = useTimer();

  const { getQuote } = useQuote();

  const { value: LSWordCount } = useLocalStorage('typer-word-count', 25);

  const focus = useFocus();

  return useCallback(
    (
      e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>
    ) => {
      e?.stopPropagation();
      const wordBox = document.getElementById('wordBox');
      if (wordBox) wordBox.scrollTop = 0;
      // if a user has not started a test or has finished the test, give them a new word list
      if ((!timer.id && !currentWordIndex && !currentCharIndex) || randomize) {
        if (settings.type === 'quotes') {
          getQuote();
        } else {
          setWordList(randomizeWords(settings));
          setWordCount(LSWordCount);
          setAuthor(null);
        }
        // otherwise reset to the current word list
      } else {
        setWordList([...wordList]);
      }

      setUserInput('');
      setInputHistory([]);
      setWordBoxConfig(defaultWordBoxConfig);
      setCurrentCharIndex(0);
      setCurrentWordIndex(0);
      setUserWordIndex(0);
      setWpm({ net: 0, raw: 0 });
      setWpmData({});
      setErrorMessage(null);

      if (timer.id) {
        clearInterval(timer.id);
      }

      resetTimer(defaultTimer);
      setTimeout(() => {
        focus();
      }, 1);
    },
    [
      setWordList,
      timer,
      resetTimer,
      setWpm,
      setWpmData,
      setUserInput,
      randomize,
      settings,
      getQuote,
      setAuthor,
      setInputHistory,
      setWordBoxConfig,
      wordList,
      currentCharIndex,
      setCurrentCharIndex,
      currentWordIndex,
      setCurrentWordIndex,
      setUserWordIndex,
      setErrorMessage,
      focus,
      setWordCount,
      LSWordCount,
      defaultTimer,
    ]
  );
};

export default useReset;
