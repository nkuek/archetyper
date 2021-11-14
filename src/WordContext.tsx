import { createContext, useState, FC, useEffect } from 'react';
import randomizedWords from 'words';

interface IProps {
  children?: React.ReactNode;
}

type TReactSetState<T> = React.Dispatch<React.SetStateAction<T>>;

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
  setWordList: TReactSetState<string[]>;
  wordCount: number;
  setWordCount: TReactSetState<number>;
  wpm: number;
  setWpm: TReactSetState<number>;
  timerId: null | NodeJS.Timeout;
  setTimerId: TReactSetState<null | NodeJS.Timeout>;
  wpmData: ITimeStepData[];
  setWpmData: TReactSetState<ITimeStepData[]>;
  timer: number;
  setTimer: TReactSetState<number>;
  focused: boolean;
  setFocused: TReactSetState<boolean>;
}

export const WordContext = createContext<IWordContext>(undefined!);

const WordContextProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(25);
  const [wpm, setWpm] = useState(0);
  const [timerId, setTimerId] = useState<null | NodeJS.Timeout>(null);
  const [wpmData, setWpmData] = useState<ITimeStepData[]>([]);
  const [timer, setTimer] = useState(1);
  const [focused, setFocused] = useState(true);

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
    focused,
    setFocused,
  };
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
