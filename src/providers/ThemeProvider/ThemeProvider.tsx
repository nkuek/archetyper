import { TReactSetState } from '../general/types';
import {
  createContext,
  useState,
  FC,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import themeList, { ITheme } from './themeList';
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

  const favicon = useMemo(() => {
    return document.getElementById('favicon') as HTMLLinkElement;
  }, []);

  useEffect(() => {
    favicon!.href = `/${themeName}Favicon.ico`;
  }, [themeName, favicon]);

  // if you instantiate useStyles in different files,
  // MUI will give them different classNames
  // instantiating styles in context so that multiple files can access and remove classes
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
