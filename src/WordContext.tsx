import { createContext, useState, FC, useEffect } from 'react';
import randomizedWords from 'words';

interface IProps {
  children?: React.ReactNode;
}

interface ITimeStepData {
  wordNum: number;
  word: string;
  wpm: number;
  errors: number;
  missingChars: number;
  extraChars: number;
  incorrectChars: number;
}

interface IWordContext {
  wordList: string[];
  setWordList: React.Dispatch<React.SetStateAction<string[]>>;
  wordCount: number;
  setWordCount: React.Dispatch<React.SetStateAction<number>>;
  wpm: number;
  setWpm: React.Dispatch<React.SetStateAction<number>>;
  timerId: null | NodeJS.Timeout;
  setTimerId: React.Dispatch<React.SetStateAction<null | NodeJS.Timeout>>;
  wpmData: ITimeStepData[];
  setWpmData: React.Dispatch<React.SetStateAction<ITimeStepData[]>>;
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
}

export const WordContext = createContext<IWordContext>(undefined!);

const WordContextProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(25);
  const [wpm, setWpm] = useState(0);
  const [timerId, setTimerId] = useState<null | NodeJS.Timeout>(null);
  const [wpmData, setWpmData] = useState<ITimeStepData[]>([]);
  const [timer, setTimer] = useState(1);

  useEffect(() => {
    setWordList(randomizedWords(wordCount));
  }, [wordCount, setWordList]);

  const value = {
    wordList,
    setWordList,
    wordCount,
    setWordCount,
    wpm,
    setWpm,
    timerId,
    setTimerId,
    wpmData,
    setWpmData,
    timer,
    setTimer,
  };
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
