import { useLocalStorage } from 'hooks';
import randomizeWords from 'languages/wordListGenerator';
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TReactSetState, TCountOption } from './general/types';
import { IndexContext } from './IndexProvider';
import { SettingsContext } from './SettingsProvider';
import { TWordChar, WordListContext } from './WordListProvider';

interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: number;
  _time: number | 'endless';
  countdown?: boolean;
}

export interface IWpm {
  raw: number;
  net: number;
}

export interface IInputContext {
  userInput: string;
  setUserInput: TReactSetState<string>;
  timeOption: TCountOption;
  setTimeOption: TReactSetState<TCountOption>;
  timer: ITimerConfig;
  setTimer: TReactSetState<ITimerConfig>;
  wpm: IWpm;
  setWpm: TReactSetState<IWpm>;
  inputHistory: string[];
  setInputHistory: TReactSetState<string[]>;
  defaultTimer: ITimerConfig;
}

export const InputContext = createContext<IInputContext>(null!);

const InputProvider: FC = ({ children }) => {
  const [userInput, setUserInput] = useState('');

  const [timeOption, setTimeOption] = useLocalStorage<TCountOption>(
    'typer-time',
    30
  );
  const { settings } = useContext(SettingsContext);
  const { setCharList } = useContext(WordListContext);
  const { currentWordIndex } = useContext(IndexContext);
  const [wpm, setWpm] = useState({ raw: 0, net: 0 });
  const [inputHistory, setInputHistory] = useState<string[]>([]);

  const defaultTimer = useMemo(
    () => ({
      id: null,
      time:
        settings.type === 'timed' && timeOption !== 'endless' ? timeOption : 1,
      _time: settings.type === 'timed' ? timeOption : 1,
      countdown: settings.type === 'timed' && timeOption !== 'endless',
    }),
    [settings.type, timeOption]
  );
  const [timer, setTimer] = useState<ITimerConfig>(defaultTimer);

  useEffect(() => {
    setTimer(defaultTimer);
  }, [defaultTimer]);

  useEffect(() => {
    if (settings.type === 'quotes') return;
    const newWord = randomizeWords(settings, true);
    const wordChars: TWordChar[] = [];
    for (const char of newWord) {
      wordChars.push({ correct: null, char });
    }
    setCharList((prev) => ({
      ...prev,
      [Object.keys(prev).length]: {
        chars: wordChars,
        length: wordChars.length,
        word: newWord,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  const value = {
    timeOption,
    setTimeOption,
    timer,
    setTimer,
    userInput,
    setUserInput,
    wpm,
    setWpm,
    inputHistory,
    setInputHistory,
    defaultTimer,
  };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};

export default InputProvider;
