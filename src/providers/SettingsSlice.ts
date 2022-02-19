import { useLocalStorage } from 'hooks';
import { StoreSlice } from './store';
import { ISettings } from './WordProvider';

export const defaultSettings: ISettings = {
  capitalChars: false,
  specialChars: false,
  numbers: false,
  type: 'words',
};

export interface ISettingsSlice {
  settings: ISettings;
  setSettings: (newSettings: ISettings) => void;
}
export const SettingsSlice: StoreSlice<ISettingsSlice> = (set) => {
  const { value: settings } = useLocalStorage(
    'typer-settings',
    defaultSettings
  );
  return {
    settings,
    setSettings: (newSettings) => set(() => ({ settings: newSettings })),
  };
};
