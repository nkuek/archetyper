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
  errorMessage: string | null;
  setErrorMessage: TReactSetState<string | null>;
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
  word: string;
}

export interface ICharList {
  [key: string | number]: IChars;
}

export type TQuoteParam = 'short' | 'medium' | 'long' | 'all';

export const WordListContext = createContext<IWordListContext>(undefined!);

const WordListProvider: FC = ({ children }) => {
  const [LSWordCount] = useLocalStorage<'endless' | number>(
    'typer-word-count',
    25
  );
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(LSWordCount);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState<null | string>(null);
  const [quoteParams, setQuoteParams] = useLocalStorage<TQuoteParam>(
    'typer-quote-length',
    'medium'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      errorMessage,
      setErrorMessage,
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
      errorMessage,
      setErrorMessage,
    ]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
