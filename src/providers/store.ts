import { useLocalStorage } from 'hooks';
import create, { SetState, GetState } from 'zustand';
import { ISettingsSlice, SettingsSlice } from './SettingsSlice';
import { ITimerSlice, TimerSlice } from './TimerSlice';

export type StoreState = ITimerSlice & ISettingsSlice;

export type StoreSlice<T> = (
  set: SetState<StoreState>,
  get: GetState<StoreState>
) => T;

export const useStore = create<StoreState>((set, get) => ({
  ...SettingsSlice(set, get),
  ...TimerSlice(set, get),
}));

export const useTimer = () => {
  const { value: time } = useLocalStorage<number | 'endless'>('typer-time', 30);
  return useStore((state) => {
    const { settings } = state;
    const defaultTimer = {
      id: null,
      time: settings.type === 'timed' && time !== 'endless' ? time : 1,
      _time: settings.type === 'timed' ? time : 1,
      countdown: settings.type === 'timed' && time !== 'endless',
    };
    return {
      timer: state.timer,
      defaultTimer,
      setTimer: state.setTimer,
      updateTime: state.updateTime,
      resetTimer: state.resetTimer,
    };
  });
};

export const useSettings = () =>
  useStore((state) => ({
    settings: state.settings,
    setSettings: state.setSettings,
  }));
