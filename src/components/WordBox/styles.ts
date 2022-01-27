import { makeStyles } from '@mui/styles';
import { ITheme } from 'providers/ThemeProvider/themeList';

interface IProps {
  theme: ITheme;
}

const useStyles = makeStyles({
  '@keyframes caretFlash': {
    '50%': {
      opacity: 0.25,
    },
  },
  correct: ({ theme }: IProps) => ({
    color: theme.correct,
  }),
  incorrect: {
    color: 'red',
  },
  currentChar: {
    color: 'darkmagenta',
    animation: `$caretFlash 1.5s linear infinite`,
  },
  extra: {
    color: '#e00000',
    opacity: '.8',
  },
});

export default useStyles;
