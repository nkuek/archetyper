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

interface IWPMData {
  [key: number | string]: ITimeStepData;
}

export interface ISettings {
  specialChars: boolean;
  capitalChars: boolean;
  numbers: boolean;
  quotes: boolean;
}

interface IWpm {
  raw: number;
  net: number;
}

export interface IWordBoxConfig {
  charCount: number;
  incorrectChars: number;
  uncorrectedErrors: number;
}

interface IWordContext {
  wpm: IWpm;
  setWpm: TReactSetState<IWpm>;
  wpmData: IWPMData;
  setWpmData: TReactSetState<IWPMData>;
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
  focused: boolean;
  setFocused: TReactSetState<boolean>;
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
  charCount: 0,
  incorrectChars: 0,
  uncorrectedErrors: 0,
};

const WordContextProvider: FC<IProps> = ({ children }) => {
  const { setWordList, setWordCount, setAuthor, wordCount } =
    useContext(WordListContext);

  const [wpm, setWpm] = useState({ raw: 0, net: 0 });

  const [wpmData, setWpmData] = useState<IWPMData>({});
  const [wordBoxConfig, setWordBoxConfig] =
    useState<IWordBoxConfig>(defaultWordBoxConfig);
  const [userInput, setUserInput] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [settings, setSettings] = useState<ISettings>(
    localStorage.getItem('typer-settings')
      ? JSON.parse(localStorage.getItem('typer-settings') || '')
      : defaultSettings
  );
  const [focused, setFocused] = useState(true);
  const wordRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const { getQuote } = useQuote();

  useEffect(() => {
    if (!settings.quotes) {
      const wordCount = localStorage.getItem('typer-word-count')
        ? JSON.parse(localStorage.getItem('typer-word-count') || '')
        : 25;
      setWordList(randomizedWords(settings));
      setWordCount(wordCount);
      setAuthor(null);
    } else {
      getQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.quotes, wordCount]);

  const value = useMemo(
    () => ({
      wordBoxConfig,
      setWordBoxConfig,
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
      focused,
      setFocused,
    }),
    [
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
      wordBoxConfig,
      setWordBoxConfig,
      focused,
      setFocused,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
