import { IndexContext, TimeContext, WordContext } from 'providers';
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
    settings,
    setWordBoxConfig,
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

  const { value: LSTime } = useLocalStorage<number | 'endless'>(
    'typer-time',
    30
  );
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

      setTimer({
        id: null,
        time: settings.type === 'timed' && LSTime !== 'endless' ? LSTime : 1,
        _time: settings.type === 'timed' ? LSTime : 1,
        countdown: settings.type === 'timed' && LSTime !== 'endless',
      });
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
      LSTime,
      setErrorMessage,
      focus,
      setWordCount,
      LSWordCount,
    ]
  );
};

export default useReset;
