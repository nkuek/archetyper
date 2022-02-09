import React, { FC, useContext } from 'react';
import { Container, Typography } from '@mui/material';
import { ThemeContext, WordContext } from 'providers';
import { TReactSetState } from 'providers/general/types';

interface IProps {
  showTip: boolean;
  setShowTip: TReactSetState<boolean>;
}

const Tip: FC<IProps> = ({ showTip, setShowTip }) => {
  const { theme } = useContext(ThemeContext);
  const { textFieldRef } = useContext(WordContext);

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
          setShowTip(false);
          textFieldRef.current?.focus();
        }}
      >
        tip: press esc at any time to restart
      </Typography>
    </Container>
  );
};

export default Tip;
