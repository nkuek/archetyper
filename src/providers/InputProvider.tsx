import { useLocalStorage } from 'hooks';
import { createContext, FC, useContext, useMemo, useState } from 'react';
import { TReactSetState } from './general/types';
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

export type TTimeOption = number | 'endless';

export interface IInputContext {
  userInput: string;
  setUserInput: TReactSetState<string>;
  timeOption: TTimeOption;
  setTimeOption: TReactSetState<TTimeOption>;
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

  const [timeOption, setTimeOption] = useLocalStorage<TTimeOption>(
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
    [settings, timeOption]
  );
  const [timer, setTimer] = useState<ITimerConfig>(defaultTimer);

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
