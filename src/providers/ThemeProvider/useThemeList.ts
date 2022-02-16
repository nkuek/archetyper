import { useEffect, useMemo, useState } from 'react';

export interface ITheme {
  buttonBackground: string;
  buttonText?: string;
  pageBackground: string;
  wordBoxBackground: string;
  currentWord: string;
  currentChar: string;
  words: string;
  correct: string;
  wordsContrast?: string;
  graphText?: string;
  lineColor?: string;
  lineColor2?: string;
  headings?: string;
  gradientUnderline?: string[];
  cartesian?: string;
  border?: string;
  incorrect?: string;
  disabled?: string;
  legendBackground?: string;
}

export interface IThemeList {
  [key: string]: ITheme;
}
const useThemeList = () => {
  const getBrowserThemeMq = () =>
    window.matchMedia('(prefers-color-scheme: dark)');

  const [isDarkTheme, setIsDarkTheme] = useState(getBrowserThemeMq().matches);

  useEffect(() => {
    const setBrowserTheme = (e: MediaQueryListEvent) => {
      setIsDarkTheme(e.matches);
    };
    getBrowserThemeMq().addEventListener('change', setBrowserTheme);
    return () =>
      getBrowserThemeMq().removeEventListener('change', setBrowserTheme);
  }, []);

  return useMemo<IThemeList>(
    () => ({
      1976: {
        buttonBackground:
          'linear-gradient(135deg, rgb(93, 207, 184) 20%, rgb(215, 56, 17) 20%, rgb(215, 56, 17) 40%, rgb(225, 107, 6) 40%, rgb(225, 107, 6) 60%, rgb(225, 186, 69) 60%, rgb(225, 186, 69) 80%, rgb(91, 50, 23) 80%)',
        buttonText: '#66d2bc',
        pageBackground:
          'linear-gradient(135deg, rgb(93, 207, 184) 20%, rgb(215, 56, 17) 20%, rgb(215, 56, 17) 40%, rgb(225, 107, 6) 40%, rgb(225, 107, 6) 60%, rgb(225, 186, 69) 60%, rgb(225, 186, 69) 80%, rgb(91, 50, 23) 80%)',
        wordBoxBackground: '#492812',
        currentWord: 'hsl(28deg 94% 58%)',
        currentChar: 'hsl(28deg 94% 30%)',
        words: '#66d2bc',
        correct: 'hsl(45deg 72% 60%)',
        wordsContrast: 'rgb(33, 38, 45)',
        graphText: 'hsl(45deg 72% 58%)',
        lineColor: '#66d2bc',
        headings: 'black',
        gradientUnderline: ['#d73811', '#e1ba45'],
        cartesian: 'hsl(45deg 72% 58%)',
        disabled: '#ddd',
        lineColor2: 'hsl(45deg 72% 58%)',
      },
      8008: {
        buttonBackground: 'hsl(215deg 18% 29%)',
        buttonText: 'hsl(342deg 88% 63%)',
        pageBackground: 'hsl(215deg 18% 29%)',
        wordBoxBackground: 'hsl(213deg 17% 69%)',
        currentWord: 'hsl(342deg 88% 63%)',
        currentChar: 'hsl(342deg 88% 33%)',
        words: '#3c4756',
        correct: '#6f7b8a',
        graphText: 'black',
        lineColor: 'hsl(342deg 88% 63%)',
        gradientUnderline: ['#6f7b8a', 'hsl(342deg 88% 63%)'],
        headings: 'hsl(342deg 88% 63%)',
        wordsContrast: 'hsl(342deg 88% 63%)',
        lineColor2: 'hsl(215deg 18% 29%)',
        legendBackground: 'white',
        incorrect: '#e00000',
      },
      mizu: {
        buttonBackground: '#253746',
        buttonText: 'white',
        pageBackground: '#253746',
        wordBoxBackground: '#b9d9eb',
        currentWord: 'hsl(269deg 67% 66%)',
        currentChar: 'hsl(269deg 67% 36%)',
        words: '#253746',
        correct: '#68b723',
        lineColor: 'hsl(269deg 67% 66%)',
        headings: 'white',
        wordsContrast: 'white',
        cartesian: '#253746',
        gradientUnderline: ['#b9d9eb', 'hsl(269deg 67% 66%)'],
      },
      gruvbox: {
        buttonBackground: '#171812',
        buttonText: '#A6E22E',
        pageBackground: '#171812',
        wordBoxBackground: '#272822',
        currentWord: 'hsl(190deg 81% 67%)',
        currentChar: 'hsl(190deg 81% 37%)',
        words: 'white',
        correct: '#A6E22E',
        lineColor: 'hsl(190deg 81% 67%)',
        headings: '#A6E22E',
        wordsContrast: '#A6E22E',
        cartesian: 'white',
        graphText: '#A6E22E',
        gradientUnderline: ['#272822', '#A6E22E'],
      },
      phantom: {
        buttonBackground: '#211333',
        buttonText: '#eed484',
        pageBackground: '#211333',
        wordBoxBackground: '#2e1a47',
        currentWord: 'hsl(269deg 67% 66%)',
        currentChar: 'hsl(269deg 67% 46%)',
        words: '#eed484',
        correct: '#68b723',
        lineColor: '#966FD6',
        headings: '#eed484',
        wordsContrast: '#eed484',
        cartesian: '#eed484',
        graphText: '#eed484',
        gradientUnderline: ['#2e1a47', '#eed484'],
      },
      jade: {
        buttonBackground: '#1B4B43',
        buttonText: '#f5d680',
        pageBackground: '#1B4B43',
        wordBoxBackground: '#4A756E',
        currentWord: 'hsl(44deg, 85%, 73%)',
        currentChar: 'hsl(44deg, 85%, 43%)',
        words: '#cdcdcd',
        correct: '#CAB19B',
        headings: '#cdcdcd',
        wordsContrast: '#cdcdcd',
        graphText: 'hsl(44deg, 85%, 73%)',
        cartesian: '#CAB19B',
        lineColor: 'hsl(44deg, 85%, 73%)',
        gradientUnderline: ['#4A756E', 'hsl(44deg, 85%, 73%)'],
      },
      default: {
        buttonBackground: isDarkTheme ? '#010409' : 'white',
        pageBackground: isDarkTheme ? '#010409' : 'white',
        wordBoxBackground: isDarkTheme ? '#0e1117' : 'white',
        currentWord: 'plum',
        currentChar: 'darkmagenta',
        words: isDarkTheme ? 'rgb(201, 209, 217)' : 'black',
        correct: 'green',
        headings: isDarkTheme ? 'rgb(201, 209, 217)' : 'black',
        border: `1px solid ${isDarkTheme ? 'rgb(33, 38, 45)' : 'black'}`,
        disabled: '#ddd',
        lineColor2: 'darkmagenta',
        legendBackground: isDarkTheme ? '#0e1117' : 'white',
        gradientUnderline: ['darkmagenta', 'plum'],
      },
    }),
    [isDarkTheme]
  );
};

export default useThemeList;
