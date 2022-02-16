import React, { FC, useContext } from 'react';
import { Container, Typography } from '@mui/material';
import { ThemeContext } from 'providers';
import { TReactSetState } from 'providers/general/types';
import { useFocus } from 'hooks';

interface IProps {
  showTip: boolean;
  setShowTip?: TReactSetState<boolean>;
  tip: string;
  warning?: boolean;
}

const Tip: FC<IProps> = ({ showTip, setShowTip, tip, warning }) => {
  const { theme } = useContext(ThemeContext);
  const focus = useFocus();

  if (!showTip) return null;

  return (
    <Container
      sx={{
        color: theme.headings,
        filter: 'brightness(70%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          cursor: 'pointer',
          position: 'absolute',
        }}
        onClick={(e) => {
          e.stopPropagation();
          setShowTip && setShowTip(false);
          focus();
        }}
      >
        {`${warning ? 'warning' : 'tip'}: ${tip}`}
      </Typography>
    </Container>
  );
};

export default Tip;
