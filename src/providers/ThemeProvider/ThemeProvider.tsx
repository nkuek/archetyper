import { TReactSetState } from 'providers/WordProvider';
import {
  createContext,
  useState,
  FC,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import themeList, { ITheme } from './themeList';

interface IProps {
  children?: React.ReactNode;
}

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
  theme: ITheme;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC<IProps> = ({ children }) => {
  const [themeName, setThemeName] = useState('default');

  useEffect(() => {
    if (localStorage.getItem('typer-theme')) {
      setThemeName(JSON.parse(localStorage.getItem('typer-theme') || ''));
    }
  }, []);

  const getTheme = useCallback(() => {
    const theme = themeList[themeName];
    return theme;
  }, [themeName]);

  console.log(getTheme());

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: getTheme(),
    }),
    [themeName, setThemeName, getTheme]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
