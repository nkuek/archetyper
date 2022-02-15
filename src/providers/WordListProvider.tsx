import { useLocalStorage } from 'hooks';
import { createContext, FC, useMemo, useState } from 'react';
import { TReactSetState } from './general/types';
interface IWordListContext {
  wordList: string[];
  setWordList: TReactSetState<string[]>;
  wordCount: number | 'endless';
  setWordCount: TReactSetState<number | 'endless'>;
  loading: boolean;
  setLoading: TReactSetState<boolean>;
  author: string | null;
  setAuthor: TReactSetState<null | string>;
  charList: ICharList;
  setCharList: TReactSetState<ICharList>;
  quoteParams: TQuoteParam;
  setQuoteParams: TReactSetState<TQuoteParam>;
}

export type TWordChar = {
  correct: null | boolean;
  extra?: boolean;
  char: string;
  skipped?: boolean;
};

export interface IChars {
  chars: TWordChar[];
  skipped?: boolean;
  length: number;
}

export interface ICharList {
  [key: string | number]: IChars;
}

export const paramsMap = {
  short: '?minLength=100&maxLength=140',
  medium: '?minLength=141&maxLength=180',
  long: '?minLength=181&maxLength=220',
};

export type TQuoteParam = 'short' | 'medium' | 'long';

export const WordListContext = createContext<IWordListContext>(undefined!);

const WordListProvider: FC = ({ children }) => {
  const { value: LSWordCount } = useLocalStorage<'endless' | number>(
    'typer-word-count',
    25
  );
  const { value: quoteLength } = useLocalStorage<TQuoteParam>(
    'typer-quote-length',
    'medium'
  );
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(LSWordCount);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<null | string>(null);
  const [quoteParams, setQuoteParams] = useState(quoteLength);

  const [charList, setCharList] = useState<ICharList>({});

  const value = useMemo(
    () => ({
      wordList,
      setWordList,
      wordCount,
      setWordCount,
      loading,
      setLoading,
      author,
      setAuthor,
      charList,
      setCharList,
      quoteParams,
      setQuoteParams,
    }),
    [
      wordList,
      setWordList,
      wordCount,
      setWordCount,
      loading,
      setLoading,
      author,
      setAuthor,
      charList,
      setCharList,
      quoteParams,
      setQuoteParams,
    ]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
