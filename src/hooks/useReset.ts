import {
  IndexContext,
  InputContext,
  SettingsContext,
  WordContext,
} from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { defaultWordBoxConfig } from 'providers/WordProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'languages/words';
import useFocus from './useFocus';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const {
    wordList,
    setWordList,
    setAuthor,
    setErrorMessage,
    setWordCount,
    wordCount,
  } = useContext(WordListContext);
  const { setWpmData, setWordBoxConfig } = useContext(WordContext);

  const { settings } = useContext(SettingsContext);

  const {
    setUserInput,
    timer,
    setTimer,
    setWpm,
    setInputHistory,
    defaultTimer,
  } = useContext(InputContext);

  const {
    currentCharIndex,
    currentWordIndex,
    setCurrentCharIndex,
    setCurrentWordIndex,
    setUserWordIndex,
  } = useContext(IndexContext);

  const { getQuote } = useQuote();

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
          setWordCount(wordCount);
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

      setTimer(defaultTimer);
      setTimeout(() => {
        focus();
      }, 1);
    },
    [
      setWordList,
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
      wordCount,
      defaultTimer,
    ]
  );
};

export default useReset;
