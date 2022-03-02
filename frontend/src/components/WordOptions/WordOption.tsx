import React, { FC } from 'react';
import { IProps } from './types';
import { Box } from '@mui/system';

const WordOption: FC<IProps> = ({ showOptions, setShowOptions, children }) => {
  return (
    <Box
      sx={{
        visibility: showOptions ? 'visible' : 'hidden',
        opacity: showOptions ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
        width: '100%',
        height: 40,
        top: 0,
        display: 'flex',
        alignItems: 'flex-end',
      }}
      onMouseEnter={() => {
        setShowOptions(true);
      }}
      onMouseLeave={() => {
        setShowOptions(false);
      }}
    >
      {children}
    </Box>
  );
};

export default WordOption;
