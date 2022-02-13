import React, { FC, createContext, useState } from 'react';
import { TReactSetState } from './general/types';

interface ICaret {
  top: number;
  left: number;
}

interface IIndexContext {
  currentCharIndex: number;
  setCurrentCharIndex: TReactSetState<number>;
  currentWordIndex: number;
  setCurrentWordIndex: TReactSetState<number>;
  userWordIndex: number;
  setUserWordIndex: TReactSetState<number>;
  caretSpacing: ICaret;
  setCaretSpacing: TReactSetState<ICaret>;
}

export const IndexContext = createContext<IIndexContext>(undefined!);

const IndexProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [caretSpacing, setCaretSpacing] = useState({ top: 0, left: 0 });
  const [userWordIndex, setUserWordIndex] = useState(0);

  return (
    <IndexContext.Provider
      value={{
        currentCharIndex,
        setCurrentCharIndex,
        currentWordIndex,
        setCurrentWordIndex,
        caretSpacing,
        setCaretSpacing,
        userWordIndex,
        setUserWordIndex,
      }}
    >
      {children}
    </IndexContext.Provider>
  );
};

export default IndexProvider;
