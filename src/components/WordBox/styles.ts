import { keyframes } from '@emotion/react';
import { makeStyles } from '@mui/styles';

export const animation = keyframes`
  50% {
    opacity: 0.25
  }
`;

export const useStyles = makeStyles({
  show: {
    visibility: 'visible',
  },
});
