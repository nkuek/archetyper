import { useQuote } from 'hooks';
import {
  createContext,
  useState,
  FC,
  useEffect,
  useMemo,
  useRef,
  useContext,
} from 'react';
import randomizedWords from 'words';
import { TReactSetState } from './general/types';
import { WordListContext } from './WordListProvider';

interface IProps {
  children?: React.ReactNode;
}

interface ITimeStepData {
  wordNum: number;
  word: string;
  wpm: IWpm;
  errors: number;
  missingChars: number;
  extraChars: number;
  incorrectChars: number;
}

export interface ISettings {
  specialChars: boolean;
  capitalChars: boolean;
  numbers: boolean;
  quotes: boolean;
}

interface IWpm {
  raw: number;
  gross: number;
}

interface IWordBoxConfig {
  focused: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  charCount: number;
  incorrectChars: number;
  totalErrors: number;
}

interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: number;
}

interface IWordContext {
  wpm: IWpm;
  setWpm: TReactSetState<IWpm>;
  wpmData: ITimeStepData[];
  setWpmData: TReactSetState<ITimeStepData[]>;
  userInput: string;
  setUserInput: TReactSetState<string>;
  inputHistory: string[];
  setInputHistory: TReactSetState<string[]>;
  wordRef: React.RefObject<HTMLDivElement>;
  textFieldRef: React.RefObject<HTMLInputElement>;
  settings: ISettings;
  setSettings: TReactSetState<ISettings>;
  wordBoxConfig: IWordBoxConfig;
  setWordBoxConfig: TReactSetState<IWordBoxConfig>;
  timer: ITimerConfig;
  setTimer: TReactSetState<ITimerConfig>;
}

export const WordContext = createContext<IWordContext>(undefined!);

export const options = [
  { name: 'quotes', value: 'quotes' },
  { name: 'capital letters', value: 'capitalChars' },
  { name: 'special characters', value: 'specialChars' },
  { name: 'numbers', value: 'numbers' },
];

export const defaultSettings = options.reduce(
  (obj, option) => ({ ...obj, [option.value]: false }),
  {} as ISettings
);

export const defaultWordBoxConfig = {
  focused: true,
  currentWordIndex: 0,
  currentCharIndex: 0,
  charCount: 0,
  incorrectChars: 0,
  totalErrors: 0,
};

const WordContextProvider: FC<IProps> = ({ children }) => {
  const { wordCount, setWordList, setWordCount } = useContext(WordListContext);

  const [wpm, setWpm] = useState({ raw: 0, gross: 0 });
  const [timer, setTimer] = useState<ITimerConfig>({ id: null, time: 1 });
  const [wpmData, setWpmData] = useState<ITimeStepData[]>([]);
  const [wordBoxConfig, setWordBoxConfig] =
    useState<IWordBoxConfig>(defaultWordBoxConfig);
  const [userInput, setUserInput] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [settings, setSettings] = useState<ISettings>(
    localStorage.getItem('typer-settings')
      ? JSON.parse(localStorage.getItem('typer-settings') || '')
      : defaultSettings
  );
  const wordRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const { getQuote } = useQuote();

  useEffect(() => {
    if (!settings.quotes) {
      setWordList(randomizedWords(settings));
      setWordCount(
        localStorage.getItem('typer-word-count')
          ? JSON.parse(localStorage.getItem('typer-word-count') || '')
          : 25
      );
    } else {
      getQuote();
    }
  }, [
    wordCount,
    setWordList,
    settings,
    settings.quotes,
    getQuote,
    setWordCount,
  ]);

  const value = useMemo(
    () => ({
      wordBoxConfig,
      setWordBoxConfig,
      timer,
      setTimer,
      wpm,
      setWpm,
      wpmData,
      setWpmData,
      userInput,
      setUserInput,
      inputHistory,
      setInputHistory,
      wordRef,
      textFieldRef,
      settings,
      setSettings,
    }),
    [
      wpm,
      setWpm,
      wpmData,
      setWpmData,
      timer,
      setTimer,
      userInput,
      setUserInput,
      inputHistory,
      setInputHistory,
      wordRef,
      textFieldRef,
      settings,
      setSettings,
      wordBoxConfig,
      setWordBoxConfig,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
