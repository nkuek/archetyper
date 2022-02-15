import { TReactSetState } from '../general/types';
import { createContext, useState, FC, useMemo, useEffect } from 'react';
import themeList, { ITheme } from './themeList';
import { useLocalStorage } from 'hooks';

interface IProps {
  children?: React.ReactNode;
}

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
  theme: ITheme;
  textColor: string;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC<IProps> = ({ children }) => {
  const { value: LSTheme } = useLocalStorage('typer-theme', 'default');
  const [themeName, setThemeName] = useState(LSTheme);

  const favicon = document.getElementById('favicon') as HTMLLinkElement;

  useEffect(() => {
    favicon!.href = `/${themeName}Favicon.ico`;
  }, [themeName, favicon]);

  const textColor = useMemo(
    () => themeList[themeName].wordsContrast || themeList[themeName].words,
    [themeName]
  );

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: themeList[themeName],
      textColor,
    }),
    [themeName, setThemeName]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
