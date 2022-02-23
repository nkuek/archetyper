import { useLocalStorage } from 'hooks';
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TReactSetState, TCountOption } from './general/types';
import { SettingsContext } from './SettingsProvider';

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
