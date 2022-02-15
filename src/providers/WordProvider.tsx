import { useLocalStorage, useQuote } from 'hooks';
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
  type: 'quotes' | 'words' | 'timed';
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

export const wordOptions = [
  { name: 'capital', value: 'capitalChars' },
  { name: 'special', value: 'specialChars' },
  { name: 'numbers', value: 'numbers' },
] as const;

export const defaultSettings: ISettings = {
  capitalChars: false,
  specialChars: false,
  numbers: false,
  type: 'words',
};

export const defaultWordBoxConfig = {
  charCount: 0,
  incorrectChars: 0,
  uncorrectedErrors: 0,
};

const WordContextProvider: FC = ({ children }) => {
  const { value: LSSettings } = useLocalStorage(
    'typer-settings',
    defaultSettings
  );
  const {
    setWordList,
    setWordCount,
    setAuthor,
    loading,
    setLoading,
    quoteParams,
  } = useContext(WordListContext);

  const [wpm, setWpm] = useState({ raw: 0, net: 0 });

  const [wpmData, setWpmData] = useState<IWPMData>({});
  const [wordBoxConfig, setWordBoxConfig] =
    useState<IWordBoxConfig>(defaultWordBoxConfig);
  const [userInput, setUserInput] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [settings, setSettings] = useState<ISettings>(LSSettings);
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

  const currentWordRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node || loading) return;
      node.scrollIntoView({ block: 'center' });
    },
    [loading]
  );

  const textFieldRef = useRef<HTMLInputElement>(null);
  const { getQuote } = useQuote();

  const { value: lsWordCount } = useLocalStorage<'endless' | number>(
    'typer-word-count',
    25
  );

  useEffect(() => {
    if (settings.type !== 'quotes') {
      const wordCount = lsWordCount;
      setWordList(randomizedWords(settings));
      setWordCount(wordCount);
      setAuthor(null);
    } else {
      getQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, quoteParams]);

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
