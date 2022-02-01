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
}

export const WordListContext = createContext<IWordListContext>(undefined!);

const WordListProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[]>([]);
  const [wordCount, setWordCount] = useState(
    localStorage.getItem('typer-word-count')
      ? JSON.parse(localStorage.getItem('typer-word-count') || '')
      : 25
  );
  const value = useMemo(
    () => ({
      wordList,
      setWordList,
      wordCount,
      setWordCount,
    }),
    [wordList, setWordList, wordCount, setWordCount]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
