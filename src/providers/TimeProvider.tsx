import { createContext, FC, useContext, useState } from 'react';
import { useLocalStorage } from 'hooks';
import { TReactSetState } from './general/types';
import { WordContext } from './WordProvider';

interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: number;
  countdown?: boolean;
}

interface ITimeContext {
  timer: ITimerConfig;
  setTimer: TReactSetState<ITimerConfig>;
}

export const TimeContext = createContext<ITimeContext>(undefined!);

const TimeProvider: FC = ({ children }) => {
  const { value: time } = useLocalStorage('typer-time', 30);
  const { settings } = useContext(WordContext);
  const [timer, setTimer] = useState<ITimerConfig>({
    id: null,
    time: settings.type === 'timed' ? time : 1,
  });

  const value = { timer, setTimer };

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
};

export default TimeProvider;
