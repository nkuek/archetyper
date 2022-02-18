import { useLocalStorage } from 'hooks';
import create, { SetState, GetState } from 'zustand';
import { ISettings } from './WordProvider';

interface ITimerConfig {
  id?: null | NodeJS.Timeout;
  time: number;
  _time: number | 'endless';
  countdown?: boolean;
}

interface ITimerSlice {
  timer: ITimerConfig;
  setTimer: (timer: ITimerConfig) => void;
  updateTime: (type: 'increment' | 'decrement') => void;
  resetTimer: () => void;
}

interface ISettingsSlice {
  settings: ISettings;
  setSettings: (newSettings: ISettings) => void;
}

export type StoreState = ITimerSlice & ISettingsSlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

export const TimerSlice: StoreSlice<ITimerSlice> = (set, get) => {
  const { value: time } = useLocalStorage<number | 'endless'>('typer-time', 30);
  console.log(get());
  const settings = get()?.settings || {};

  const defaultTimer = {
    id: null,
    time: settings.type === 'timed' && time !== 'endless' ? time : 1,
    _time: settings.type === 'timed' ? time : 1,
  };

  return {
    timer: defaultTimer,
    setTimer: (timer) => set(() => ({ timer })),
    updateTime: (type) =>
      set((state) => ({
        timer: {
          ...state.timer,
          time: state.timer.time + (type === 'increment' ? 1 : -1),
        },
      })),
    resetTimer: () => set(() => ({ timer: defaultTimer })),
  };
};

export const WordSlice: StoreSlice<ISettingsSlice> = (set) => ({
  settings: {
    capitalChars: false,
    numbers: false,
    specialChars: false,
    type: 'words',
  },
  setSettings: (newSettings) => set(() => ({ settings: newSettings })),
});

const useStore = create<StoreState>((set, get) => ({
  ...TimerSlice(set, get),
  ...WordSlice(set, get),
}));

export const useTimer = () =>
  useStore((state) => ({
    timer: state.timer,
    setTimer: state.setTimer,
    updateTime: state.updateTime,
  }));

export const useSettings = () =>
  useStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));

export default useStore;
