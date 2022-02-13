import { useQuote } from 'hooks';
import {
  createContext,
  useState,
  FC,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from 'react';
import randomizedWords from 'words';
import { TReactSetState } from './general/types';
import { ICharList, TWordChar, WordListContext } from './WordListProvider';

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
  endless: boolean;
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
  currentWordRef: (node: HTMLDivElement) => void;
  textFieldRef: React.RefObject<HTMLInputElement>;
  settings: ISettings;
  setSettings: TReactSetState<ISettings>;
  wordBoxConfig: IWordBoxConfig;
  setWordBoxConfig: TReactSetState<IWordBoxConfig>;
  focused: boolean;
  setFocused: TReactSetState<boolean>;
  generateCharList: (wordList: string[] | string) => ICharList;
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
  const { setWordList, setWordCount, setAuthor, loading, setLoading } =
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

  const generateCharList = useCallback(
    (wordList: string[] | string) => {
      const charList: ICharList = {};
      if (wordList.length) {
        for (let i = 0; i < wordList.length; i++) {
          const word = wordList[i];
          const wordChars: TWordChar[] = [];
          for (const char of word) {
            wordChars.push({
              correct: null,
              char,
            });
          }
          charList[i] = {
            chars: wordChars,
            length: word.length,
          };
        }
      }
      setLoading(false);
      return charList;
    },
    [setLoading]
  );

  const currentWordObserver = useRef<IntersectionObserver>();

  const currentWordRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      const wordBox = document.getElementById('wordBox');
      if (currentWordObserver.current) currentWordObserver.current.disconnect();

      currentWordObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            entries[0].target.scrollIntoView({ block: 'center' });
          }
        },
        { root: wordBox, threshold: 0.1 }
      );

      if (currentWordObserver.current && node)
        currentWordObserver.current.observe(node);
    },
    [loading]
  );

  const textFieldRef = useRef<HTMLInputElement>(null);
  const { getQuote } = useQuote();

  useEffect(() => {
    if (!settings.quotes) {
      const wordCount = localStorage.getItem('typer-word-count')
        ? JSON.parse(localStorage.getItem('typer-word-count') || '')
        : settings.endless
        ? 'endless'
        : 25;
      setWordList(randomizedWords(settings));
      setWordCount(wordCount);
      setAuthor(null);
    } else {
      getQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

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
      currentWordRef,
      textFieldRef,
      settings,
      setSettings,
      focused,
      setFocused,
      generateCharList,
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
      currentWordRef,
      textFieldRef,
      settings,
      setSettings,
      wordBoxConfig,
      setWordBoxConfig,
      focused,
      setFocused,
      generateCharList,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
