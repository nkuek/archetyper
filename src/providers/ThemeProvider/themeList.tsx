export interface ITheme {
  buttonBackground: string;
  pageBackground: string;
  wordBoxBackground: string;
  currentWord: string;
  currentChar: string;
  words: string;
  correct: string;
}
export interface IThemeList {
  [key: string]: ITheme;
}
const themeList: IThemeList = {
  1976: {
    buttonBackground:
      'linear-gradient(135deg, rgb(93, 207, 184) 20%, rgb(215, 56, 17) 20%, rgb(215, 56, 17) 40%, rgb(225, 107, 6) 40%, rgb(225, 107, 6) 60%, rgb(225, 186, 69) 60%, rgb(225, 186, 69) 80%, rgb(91, 50, 23) 80%)',
    pageBackground:
      'linear-gradient(135deg, rgb(93, 207, 184) 20%, rgb(215, 56, 17) 20%, rgb(215, 56, 17) 40%, rgb(225, 107, 6) 40%, rgb(225, 107, 6) 60%, rgb(225, 186, 69) 60%, rgb(225, 186, 69) 80%, rgb(91, 50, 23) 80%)',
    wordBoxBackground: '#492812',
    currentWord: 'hsl(28deg 94% 58%)',
    currentChar: 'hsl(28deg 94% 30%)',
    words: '#66d2bc',
    correct: 'hsl(45deg 72% 60%)',
  },
  default: {
    buttonBackground: 'white',
    pageBackground: 'white',
    wordBoxBackground: 'white',
    currentWord: 'plum',
    currentChar: 'darkmagenta',
    words: 'black',
    correct: 'green',
  },
};
export default themeList;
