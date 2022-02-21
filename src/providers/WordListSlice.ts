import { StoreSlice } from './store';

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
export interface IWordListSlice {
  wordList: string[];
  setWordList: (wordList: string[]) => void;
  wordCount: number | 'endless';
  setWordCount: (wordCount: number | 'endless') => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  author: string | null;
  setAuthor: (author: string | null) => void;
  charList: ICharList;
  setCharList: (charList: ICharList) => void;
  addToCharList: (charList: ICharList) => void;
  quoteParams: TQuoteParam;
  setQuoteParams: (quoteParam: TQuoteParam) => void;
  errorMessage: string | null;
  setErrorMessage: (error: string | null) => void;
}

export const WordListSlice: StoreSlice<IWordListSlice> = (set) => ({
  wordList: [],
  setWordList: (wordList) => set(() => ({ wordList })),
  wordCount: 25,
  setWordCount: (wordCount) => set(() => ({ wordCount })),
  loading: false,
  setLoading: (loading) => set(() => ({ loading })),
  author: null,
  setAuthor: (author) => set(() => ({ author })),
  charList: {},
  setCharList: (charList) =>
    set(() => ({
      charList,
    })),
  addToCharList: (charList) =>
    set((state) => ({ charList: { ...state.charList, ...charList } })),
  quoteParams: 'medium',
  setQuoteParams: (quoteParams) => set(() => ({ quoteParams })),
  errorMessage: null,
  setErrorMessage: (errorMessage) => set(() => ({ errorMessage })),
});
