import { createContext, useContext, useState, FC } from 'react';

interface IProps {
  children?: React.ReactNode;
}

interface IWordContext {
  wordList: string[] | [];
  setWordList: React.Dispatch<React.SetStateAction<[] | string[]>>;
  wordCount: number;
  setWordCount: React.Dispatch<React.SetStateAction<number>>;
  wpm: number;
  setWpm: React.Dispatch<React.SetStateAction<number>>;
  timerId: null | NodeJS.Timeout;
  setTimerId: React.Dispatch<React.SetStateAction<null | NodeJS.Timeout>>;
}

export const WordContext = createContext<IWordContext>(undefined!);

const WordContextProvider: FC<IProps> = ({ children }) => {
  const [wordList, setWordList] = useState<string[] | []>([]);
  const [wordCount, setWordCount] = useState(50);
  const [wpm, setWpm] = useState(0);
  const [timerId, setTimerId] = useState<null | NodeJS.Timeout>(null);

  const value = {
    wordList,
    setWordList,
    wordCount,
    setWordCount,
    wpm,
    setWpm,
    timerId,
    setTimerId,
  };
  return <WordContext.Provider value={value}>{children}</WordContext.Provider>;
};

export default WordContextProvider;
