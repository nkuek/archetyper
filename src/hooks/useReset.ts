import { IndexContext, TimeContext, WordContext } from 'providers';
import { WordListContext } from 'providers/WordListProvider';
import { defaultWordBoxConfig } from 'providers/WordProvider';
import { useCallback, useContext } from 'react';
import randomizeWords from 'words';
import useQuote from './useQuote';

const useReset = (randomize = false) => {
  const { wordList, setWordList, setAuthor } = useContext(WordListContext);
  const {
    wordRef,
    textFieldRef,
    setWpm,
    setWpmData,
    setUserInput,
    setInputHistory,
    settings,
    setWordBoxConfig,
    setFocused,
  } = useContext(WordContext);

  const {
    currentCharIndex,
    currentWordIndex,
    setCurrentCharIndex,
    setCurrentWordIndex,
  } = useContext(IndexContext);

  const { timer, setTimer } = useContext(TimeContext);

  const { getQuote } = useQuote();

  return useCallback(
    (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
      e.stopPropagation();
      if (wordRef.current && textFieldRef.current) {
        wordRef.current.children[0]?.scrollIntoView({
          block: 'center',
        });
      }
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
      setWpm({ net: 0, raw: 0 });
      setWpmData({});
      setFocused(true);
      if (timer.id) {
        clearInterval(timer.id);
        setTimer({ id: null, time: 1 });
      }
    },
    [
      wordRef,
      textFieldRef,
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
    ]
  );
};

export default useReset;
