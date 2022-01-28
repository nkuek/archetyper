import { createContext, useState, FC, useEffect, useMemo, useRef } from 'react';
import randomizedWords from 'words';
import { TReactSetState } from './general/types';

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
  currentWordIndex: number;
  setCurrentWordIndex: TReactSetState<number>;
  currentCharIndex: number;
  setCurrentCharIndex: TReactSetState<number>;
  charCount: number;
  setCharCount: TReactSetState<number>;
  incorrectChars: number;
  setIncorrectChars: TReactSetState<number>;
  userInput: string;
  setUserInput: TReactSetState<string>;
  wordRef: React.RefObject<HTMLDivElement>;
  textFieldRef: React.RefObject<HTMLDivElement>;
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const wordRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWordList(randomizedWords());
  }, [wordCount, setWordList]);

  const value = useMemo(
    () => ({
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
      currentCharIndex,
      setCurrentCharIndex,
      currentWordIndex,
      setCurrentWordIndex,
      userInput,
      setUserInput,
      charCount,
      setCharCount,
      incorrectChars,
      setIncorrectChars,
      wordRef,
      textFieldRef,
    }),
    [
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
      currentCharIndex,
      setCurrentCharIndex,
      currentWordIndex,
      setCurrentWordIndex,
      userInput,
      setUserInput,
      charCount,
      setCharCount,
      incorrectChars,
      setIncorrectChars,
      wordRef,
      textFieldRef,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
