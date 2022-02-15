import { TReactSetState } from '../general/types';
import { createContext, useState, FC, useMemo, useEffect } from 'react';
import { useLocalStorage } from 'hooks';
import useThemeList, { ITheme } from './useThemeList';

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
  theme: ITheme;
  textColor: string;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC = ({ children }) => {
  const themeList = useThemeList();
  const { value: LSTheme } = useLocalStorage('typer-theme', 'default');
  const [themeName, setThemeName] = useState(LSTheme);

  const favicon = document.getElementById('favicon') as HTMLLinkElement;

  useEffect(() => {
    favicon!.href = `/${themeName}Favicon.ico`;
  }, [themeName, favicon]);

  const textColor = useMemo(
    () => themeList[themeName].wordsContrast || themeList[themeName].words,
    [themeName, themeList]
  );

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: themeList[themeName],
      textColor,
    }),
    [themeName, setThemeName, textColor, themeList]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
