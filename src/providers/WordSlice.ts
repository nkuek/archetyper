import { StoreSlice } from './store';
import { ICharList, TWordChar } from './WordListSlice';

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

export interface IWordSlice {
  wpm: IWpm;
  setWpm: (wpm: IWpm) => void;
  wpmData: IWPMData;
  appendWpmData: (wpmData: IWPMData) => void;
  userInput: string;
  setUserInput: (userInput: string) => void;
  inputHistory: string[];
  appendInputHistory: (inputHistory: string) => void;
  wordBoxConfig: IWordBoxConfig;
  setWordBoxConfig: (wordBoxConfig: IWordBoxConfig) => void;
  updateWordBoxConfig: (missingChars: number) => void;
  focused: boolean;
  setFocused: (focused: boolean) => void;
  generateCharList: (wordList: string[] | string) => ICharList;
}

export const WordSlice: StoreSlice<IWordSlice> = (set) => ({
  wpm: { raw: 0, net: 0 },
  setWpm: (wpm) =>
    set(() => ({
      wpm,
    })),
  wpmData: {},
  appendWpmData: (wpmData) => set((state) => ({ ...state.wpmData, wpmData })),
  userInput: '',
  setUserInput: (userInput) => set(() => ({ userInput })),
  inputHistory: [],
  appendInputHistory: (inputHistory) =>
    set((state) => ({ inputHistory: [...state.inputHistory, inputHistory] })),
  wordBoxConfig: { charCount: 0, incorrectChars: 0, uncorrectedErrors: 0 },
  setWordBoxConfig: (wordBoxConfig) =>
    set(() => ({
      wordBoxConfig,
    })),
  updateWordBoxConfig: (missingChars) =>
    set((state) => ({
      wordBoxConfig: {
        ...state.wordBoxConfig,
        charCount: state.wordBoxConfig.charCount + 1,
        incorrectChars: 0,
        uncorrectedErrors: state.wordBoxConfig.uncorrectedErrors + missingChars,
      },
    })),
  focused: true,
  setFocused: (focused) =>
    set(() => ({
      focused,
    })),
  generateCharList: (wordList) => {
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
  },
});
