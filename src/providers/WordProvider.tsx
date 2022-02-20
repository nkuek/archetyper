import { useLocalStorage, useQuote } from 'hooks';
import { useSettings } from 'providers';
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
import { IndexContext } from './IndexProvider';
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
  currentWordRef: React.MutableRefObject<HTMLDivElement | null>;
  textFieldRef: React.RefObject<HTMLInputElement>;
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
  const { setWordList, setAuthor, loading, quoteParams } =
    useContext(WordListContext);
  const { setCaretSpacing, currentWordIndex } = useContext(IndexContext);

  const [wpm, setWpm] = useState({ raw: 0, net: 0 });

  const [wpmData, setWpmData] = useState<IWPMData>({});
  const [wordBoxConfig, setWordBoxConfig] =
    useState<IWordBoxConfig>(defaultWordBoxConfig);
  const [userInput, setUserInput] = useState('');
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const { settings } = useSettings();
  const [focused, setFocused] = useState(true);

  const generateCharList = useCallback((wordList: string[] | string) => {
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
          word,
        };
      }
    }
    return charList;
  }, []);

  const currentWordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentWordRef.current || loading) return;
    currentWordRef.current.scrollIntoView({ block: 'center' });
    setTimeout(() => {
      if (!currentWordRef.current) return;
      setCaretSpacing({
        top: currentWordRef.current.offsetTop,
        left: currentWordRef.current.offsetLeft,
      });
    }, 25);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  const textFieldRef = useRef<HTMLInputElement>(null);
  const { getQuote } = useQuote();

  useEffect(() => {
    if (settings.type !== 'quotes') {
      setWordList(randomizedWords(settings));
      setAuthor(null);
      // asynchronous timeout to generate new word list before focusing
      setTimeout(() => {
        setFocused(true);
      }, 1);
    } else {
      getQuote();
      setFocused(true);
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
