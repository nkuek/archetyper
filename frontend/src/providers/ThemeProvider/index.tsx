import { TReactSetState } from '../general/types';
import { createContext, FC, useMemo, useEffect } from 'react';
import { useLocalStorage } from 'hooks';
import useThemeList, { ITheme } from './useThemeList';
import { CssBaseline, GlobalStyles } from '@mui/material';
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from '@mui/material/styles';

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
  theme: ITheme;
  textColor: string;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC = ({ children }) => {
  const themeList = useThemeList();
  const [themeName, setThemeName] = useLocalStorage('typer-theme', 'default');

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

  const muiTheme = createTheme();
  return (
    <MuiThemeProvider theme={{ ...muiTheme, ...themeList[themeName] }}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { backgroundColor: themeList[themeName].pageBackground },
        }}
      />
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
