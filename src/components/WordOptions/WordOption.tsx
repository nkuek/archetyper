import React, { FC } from 'react';
import { IProps, IOptions } from './types';
import { Box } from '@mui/system';
import { TReactSetState } from 'providers/general/types';

const WordOption: FC<IProps> = ({ setShowOptions, showOptions, children }) => {
  return (
    <Box
      onMouseLeave={() => setShowOptions(false)}
      onMouseEnter={() => setShowOptions(true)}
      sx={{
        visibility: showOptions ? 'visible' : 'hidden',
        opacity: showOptions ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
        height: 40,
      }}
    >
      {children}
    </Box>
  );
};

export default WordOption;