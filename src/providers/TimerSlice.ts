import { StoreSlice } from './store';

export interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: any;
  _time: number | 'endless';
  countdown?: boolean;
}

export interface ITimerSlice {
  timer: ITimerConfig;
  setTimer: (timer: ITimerConfig) => void;
  updateTime: (type: 'increment' | 'decrement') => void;
  resetTimer: (defaultTimer: ITimerConfig) => void;
}

export const TimerSlice: StoreSlice<ITimerSlice> = (set) => ({
  timer: { id: null, time: 1, _time: 1 },
  setTimer: (timer) => set(() => ({ timer })),
  updateTime: (type) =>
    set((state) => ({
      timer: {
        ...state.timer,
        time: state.timer.time + (type === 'increment' ? 1 : -1),
      },
    })),
  resetTimer: (defaultTimer) =>
    set(() => ({
      timer: defaultTimer,
    })),
});
