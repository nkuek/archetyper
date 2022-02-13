import { IndexContext, TimeContext, WordContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { defaultWordBoxConfig } from 'providers/WordProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const { wordList, setWordList, setAuthor } = useContext(WordListContext);
  const {
    setWpm,
    setWpmData,
    setUserInput,
    setInputHistory,
    settings,
    setWordBoxConfig,
    setFocused,
    textFieldRef,
  } = useContext(WordContext);

  const {
    currentCharIndex,
    currentWordIndex,
    setCurrentCharIndex,
    setCurrentWordIndex,
    setUserWordIndex,
  } = useContext(IndexContext);

  const { timer, setTimer } = useContext(TimeContext);

  const { getQuote } = useQuote();

  return useCallback(
    (e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e?.stopPropagation();
      const wordBox = document.getElementById('wordBox');
      if (wordBox) wordBox.scrollTop = 0;
      if (textFieldRef.current) textFieldRef.current.focus();
      // if a user has not started a test or has finished the test, give them a new word list
      if ((!timer.id && !currentWordIndex && !currentCharIndex) || randomize) {
        if (settings.quotes) {
          getQuote();
        } else {
          setWordList(randomizeWords(settings));
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
      setFocused(true);
      if (timer.id) {
        clearInterval(timer.id);
        setTimer({ id: null, time: 1 });
      }
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
      setFocused,
      textFieldRef,
      setUserWordIndex,
    ]
  );
};

export default useReset;
