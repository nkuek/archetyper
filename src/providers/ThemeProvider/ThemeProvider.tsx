import { TReactSetState } from '../general/types';
import { createContext, useState, FC, useMemo, useEffect } from 'react';
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
  const [themeName, setThemeName] = useState(
    localStorage.getItem('typer-theme')
      ? JSON.parse(localStorage.getItem('typer-theme') || '')
      : 'default'
  );

  const favicon = document.getElementById('favicon') as HTMLLinkElement;

  useEffect(() => {
    favicon!.href = `/${themeName}Favicon.ico`;
  }, [themeName, favicon]);

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: themeList[themeName],
    }),
    [themeName, setThemeName]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
