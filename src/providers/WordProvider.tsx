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

export interface ISettings {
  specialChars: boolean;
  capitalChars: boolean;
  numbers: boolean;
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
  textFieldRef: React.RefObject<HTMLInputElement>;
  settings: ISettings;
  setSettings: TReactSetState<ISettings>;
}

export const WordContext = createContext<IWordContext>(undefined!);

export const options = [
  { name: 'capital letters', value: 'capitalChars' },
  { name: 'special characters', value: 'specialChars' },
  { name: 'numbers', value: 'numbers' },
];

const WordContextProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(
    localStorage.getItem('typer-word-count')
      ? JSON.parse(localStorage.getItem('typer-word-count') || '')
      : 25
  );
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
  const [settings, setSettings] = useState<ISettings>(
    localStorage.getItem('typer-settings')
      ? JSON.parse(localStorage.getItem('typer-settings') || '')
      : options.reduce((obj, option) => ({ ...obj, [option.value]: false }), {})
  );

  const wordRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWordList(randomizedWords(settings));
  }, [wordCount, setWordList, settings]);

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
      settings,
      setSettings,
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
      settings,
      setSettings,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
