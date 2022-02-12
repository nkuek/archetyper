import { createContext, FC, useCallback, useMemo, useState } from 'react';
import { maxWords } from 'words';
import { TReactSetState } from './general/types';

interface IProps {
  children?: React.ReactNode;
}

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
  charListNumber: number;
  setCharListNumber: TReactSetState<number>;
  generateCharList: (wordList: string[], charListNumber: number) => ICharList;
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
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<null | string>(null);

  const [charList, setCharList] = useState<ICharList>({});
  const [charListNumber, setCharListNumber] = useState(0);

  const generateCharList = useCallback(
    (wordList: string[], charListNumber?: number) => {
      const charList: ICharList = {};
      if (wordList.length) {
        for (let i = 0; i < wordList.length; i++) {
          const word = wordList[i];
          const wordChars: TWordChar[] = [];
          for (const char of word) {
            wordChars.push({ correct: null, char, extra: false });
          }
          charList[i + (charListNumber ? maxWords * charListNumber : 0)] = {
            skipped: false,
            chars: wordChars,
            length: word.length,
          };
        }
      }
      setLoading(false);
      setCharListNumber((prev) => prev + 1);
      return charList;
    },
    [setLoading, setCharListNumber]
  );

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
      generateCharList,
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
      generateCharList,
    ]
  );
  return (
    <WordListContext.Provider value={value}>
      {children}
    </WordListContext.Provider>
  );
};

export default WordListProvider;
