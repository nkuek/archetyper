import {
  IndexContext,
  InputContext,
  SettingsContext,
  WordContext,
  WordListContext,
} from 'providers';
import { useContext, useEffect } from 'react';

const calculateWpm = (charCount: number, timer: number, errors: number) => {
  const timeToMins = timer / 60;
  const raw = Math.floor(charCount / 5 / timeToMins);
  const uncorrectedErrors = Math.floor(errors / timeToMins);
  const net = Math.max(raw - uncorrectedErrors, 0);

  return {
    raw,
    net,
  };
};

export const useTimerLogic = () => {
  const { timer, setTimer, userInput, timeOption, setWpm } =
    useContext(InputContext);
  const { settings } = useContext(SettingsContext);
  const { currentWordIndex } = useContext(IndexContext);
  const { charList, wordCount } = useContext(WordListContext);
  const {
    wordBoxConfig: { charCount, uncorrectedErrors },
  } = useContext(WordContext);

  useEffect(() => {
    const time =
      timer.countdown && timeOption !== 'endless'
        ? timeOption - timer.time + 1
        : timer.time;
    setWpm(calculateWpm(charCount, time, uncorrectedErrors));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.time, charCount, uncorrectedErrors]);

  useEffect(() => {
    if (!timer.id && userInput) {
      const intervalTimer = setInterval(
        () =>
          setTimer((prev) => ({
            ...prev,
            time:
              prev.time +
              (timer.countdown && timeOption !== 'endless' ? -1 : 1),
          })),
        1000
      );
      setTimer((prev) => ({ ...prev, id: intervalTimer }));
    } else if (
      timer.id &&
      ((timer.countdown && timeOption !== 'endless' && timer.time === 0) ||
        (settings.type !== 'timed' &&
          wordCount !== 'endless' &&
          currentWordIndex === wordCount - 1 &&
          userInput === charList[wordCount - 1].word))
    ) {
      clearInterval(timer.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, currentWordIndex, timer, charList, wordCount]);
};
