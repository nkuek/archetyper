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
import { TReactSetState } from './general/types';
import { IndexContext } from './IndexProvider';
import { IWpm } from './InputProvider';
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

export interface IWordBoxConfig {
  charCount: number;
  incorrectChars: number;
  uncorrectedErrors: number;
}

interface IWordContext {
  wpmData: IWPMData;
  setWpmData: TReactSetState<IWPMData>;
  currentWordRef: React.MutableRefObject<HTMLDivElement | null>;
  textFieldRef: React.RefObject<HTMLInputElement>;
  wordBoxConfig: IWordBoxConfig;
  setWordBoxConfig: TReactSetState<IWordBoxConfig>;
  generateCharList: (wordList: string[] | string) => ICharList;
}

export const WordContext = createContext<IWordContext>(undefined!);

export const wordOptions = [
  { name: 'capital', value: 'capitalChars' },
  { name: 'special', value: 'specialChars' },
  { name: 'numbers', value: 'numbers' },
] as const;

export const defaultWordBoxConfig = {
  charCount: 0,
  incorrectChars: 0,
  uncorrectedErrors: 0,
};

const WordContextProvider: FC = ({ children }) => {
  const { loading } = useContext(WordListContext);
  const { setCaretSpacing, currentWordIndex } = useContext(IndexContext);

  const [wpmData, setWpmData] = useState<IWPMData>({});
  const [wordBoxConfig, setWordBoxConfig] =
    useState<IWordBoxConfig>(defaultWordBoxConfig);

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

  const value = useMemo(
    () => ({
      wordBoxConfig,
      setWordBoxConfig,
      wpmData,
      setWpmData,
      currentWordRef,
      textFieldRef,
      generateCharList,
    }),
    [
      wpmData,
      setWpmData,
      currentWordRef,
      textFieldRef,
      wordBoxConfig,
      setWordBoxConfig,
      generateCharList,
    ]
  );
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
