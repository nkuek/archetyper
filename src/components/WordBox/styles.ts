import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  '@keyframes caretFlash': {
    '50%': {
      opacity: 0.25,
    },
  },
  animation: {
    animation: `$caretFlash 1.5s linear infinite`,
  },
});

export default useStyles;
