import { TReactSetState } from '../general/types';
import { createContext, useState, FC, useMemo, useCallback } from 'react';
import themeList, { ITheme } from './themeList';
import { ClassNameMap } from '@mui/styles';
import useStyles from 'components/WordBox/styles';

interface IProps {
  children?: React.ReactNode;
}

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
  theme: ITheme;
  classes: ReturnType<typeof useStyles>;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC<IProps> = ({ children }) => {
  const [themeName, setThemeName] = useState(
    localStorage.getItem('typer-theme')
      ? JSON.parse(localStorage.getItem('typer-theme') || '')
      : 'default'
  );

  const getTheme = useCallback(() => {
    const theme = themeList[themeName];
    return theme;
  }, [themeName]);

  const classes = useStyles({ theme: getTheme() });

  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme: getTheme(),
      classes,
    }),
    [themeName, setThemeName, getTheme, classes]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
