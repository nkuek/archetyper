import { createContext, FC, useMemo, useState } from 'react';
import { TReactSetState } from './general/types';

interface IProps {
  children?: React.ReactNode;
}

interface IWordListContext {
  wordList: string[];
  setWordList: TReactSetState<string[]>;
  wordCount: number | null;
  setWordCount: TReactSetState<number | null>;
  loading: boolean;
  setLoading: TReactSetState<boolean>;
  author: string | null;
  setAuthor: TReactSetState<null | string>;
  charList: ICharList;
  setCharList: TReactSetState<ICharList>;
  charListNumber: number;
  setCharListNumber: TReactSetState<number>;
}

export type TWordChar = {
  [key: string]: any;
  correct: null | boolean;
  extra: boolean;
  char: string;
};

export interface IChars {
  chars: TWordChar[];
  skipped: boolean;
  length: number;
}

export interface ICharList {
  [key: string | number]: IChars;
}

export const WordListContext = createContext<IWordListContext>(undefined!);

const WordListProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(
    localStorage.getItem('typer-word-count')
      ? JSON.parse(localStorage.getItem('typer-word-count') || '')
      : 25
  );
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState<null | string>(null);

  const [charList, setCharList] = useState<ICharList>({});
  const [charListNumber, setCharListNumber] = useState(1);

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
      charListNumber,
      setCharListNumber,
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
      charListNumber,
      setCharListNumber,
    ]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
