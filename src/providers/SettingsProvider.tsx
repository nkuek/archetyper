import {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocalStorage, useQuote } from 'hooks';
import { TReactSetState } from './general/types';
import { WordListContext } from './WordListProvider';
import randomizedWords, { languageMap } from 'languages/words';

export interface ISettings {
  specialChars: boolean;
  capitalChars: boolean;
  numbers: boolean;
  type: 'quotes' | 'words' | 'timed';
  language: keyof typeof languageMap;
}

export interface ISettingsContext {
  settings: ISettings;
  setSettings: TReactSetState<ISettings>;
  focused: boolean;
  setFocused: TReactSetState<boolean>;
}

export const defaultSettings: ISettings = {
  capitalChars: false,
  specialChars: false,
  numbers: false,
  type: 'words',
  language: 'english',
};

export const SettingsContext = createContext<ISettingsContext>(null!);

const SettingsProvider: FC = ({ children }) => {
  const [settings, setSettings] = useLocalStorage(
    'typer-settings',
    defaultSettings
  );

  const { setWordList, setAuthor, quoteParams } = useContext(WordListContext);

  const { getQuote } = useQuote();

  const [focused, setFocused] = useState(true);

  useEffect(() => {
    if (settings.type !== 'quotes') {
      setWordList(randomizedWords(settings));
      setAuthor(null);
      // asynchronous timeout to generate new word list before focusing
      setTimeout(() => {
        setFocused(true);
      }, 1);
    } else {
      getQuote();
      setFocused(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, quoteParams]);

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      focused,
      setFocused,
    }),
    [settings, setSettings, focused, setFocused]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
