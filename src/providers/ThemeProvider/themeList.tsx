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
  headings?: string;
  gradientUnderline?: string[];
  cartesian?: string;
  border?: string;
}
export interface IThemeList {
  [key: string]: ITheme;
}
const themeList: IThemeList = {
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
    wordsContrast: 'black',
    graphText: 'hsl(45deg 72% 58%)',
    lineColor: '#66d2bc',
    headings: 'black',
    gradientUnderline: ['#d73811', '#e1ba45'],
    cartesian: 'hsl(45deg 72% 58%)',
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
  default: {
    buttonBackground: 'white',
    pageBackground: 'white',
    wordBoxBackground: 'white',
    currentWord: 'plum',
    currentChar: 'darkmagenta',
    words: 'black',
    correct: 'green',
    headings: 'black',
    border: '1px solid black',
  },
};
export default themeList;
