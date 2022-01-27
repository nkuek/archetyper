import { TReactSetState } from 'providers/WordProvider';
import { createContext, useState, FC, useMemo } from 'react';
import themeList from './themeList';

interface IProps {
  children?: React.ReactNode;
}

interface IThemeContext {
  themeName: string;
  setThemeName: TReactSetState<string>;
}

export const ThemeContext = createContext<IThemeContext>(undefined!);

const ThemeProvider: FC<IProps> = ({ children }) => {
  const [themeName, setThemeName] = useState('default');
  const theme = useMemo(
    () => themeList[themeName as keyof typeof themeList],
    [themeName]
  );
  const value = useMemo(
    () => ({
      themeName,
      setThemeName,
      theme,
    }),
    [themeName, setThemeName, theme]
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
