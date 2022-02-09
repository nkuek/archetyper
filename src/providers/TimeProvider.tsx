import { createContext, FC, useState } from 'react';
import { TReactSetState } from './general/types';

interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: number;
}

interface ITimeContext {
  timer: ITimerConfig;
  setTimer: TReactSetState<ITimerConfig>;
}

export const TimeContext = createContext<ITimeContext>(undefined!);

const TimeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timer, setTimer] = useState<ITimerConfig>({ id: null, time: 1 });

  const value = { timer, setTimer };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export default TimeProvider;
