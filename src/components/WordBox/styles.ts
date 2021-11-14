import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  '@keyframes caretFlash': {
    '50%': {
      opacity: 0.25,
    },
  },
  correct: {
    color: 'green',
  },
  incorrect: {
    color: 'red',
  },
  currentWord: {
    color: 'plum',
  },
  currentChar: {
    color: 'darkmagenta',
    animation: `$caretFlash 1.5s linear infinite`,
  },
});

export default useStyles;
