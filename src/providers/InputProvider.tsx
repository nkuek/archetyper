import { useLocalStorage } from 'hooks';
import { createContext, FC, useContext, useState } from 'react';
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

export interface IInputContext {
  userInput: string;
  setUserInput: TReactSetState<string>;
  timer: ITimerConfig;
  setTimer: TReactSetState<ITimerConfig>;
  wpm: IWpm;
  setWpm: TReactSetState<IWpm>;
  inputHistory: string[];
  setInputHistory: TReactSetState<string[]>;
}

export const InputContext = createContext<IInputContext>(null!);

const InputProvider: FC = ({ children }) => {
  const [userInput, setUserInput] = useState('');

  const { value: time } = useLocalStorage<number | 'endless'>('typer-time', 30);
  const { settings } = useContext(SettingsContext);
  const [wpm, setWpm] = useState({ raw: 0, net: 0 });
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [timer, setTimer] = useState<ITimerConfig>({
    id: null,
    time: settings.type === 'timed' && time !== 'endless' ? time : 1,
    _time: settings.type === 'timed' ? time : 1,
    countdown: settings.type === 'timed' && time !== 'endless',
  });

  const value = {
    timer,
    setTimer,
    userInput,
    setUserInput,
    wpm,
    setWpm,
    inputHistory,
    setInputHistory,
  };

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  );
};

export default InputProvider;
