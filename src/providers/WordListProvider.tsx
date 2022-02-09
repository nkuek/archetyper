import { createContext, FC, useMemo, useState } from 'react';
import { TReactSetState } from './general/types';

interface IProps {
  children?: React.ReactNode;
}

interface IWordListContext {
  wordList: string[];
  setWordList: TReactSetState<string[]>;
  wordCount: number;
  setWordCount: TReactSetState<number>;
  loading: boolean;
  setLoading: TReactSetState<boolean>;
  author: string | null;
  setAuthor: TReactSetState<null | string>;
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
    ]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
