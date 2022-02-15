import React, { FC } from 'react';
import { TReactSetState } from 'providers/general/types';
import { IProps, IOptions } from './types';
import { Box } from '@mui/system';

interface IWordProps extends IProps {
  option: keyof IOptions;
  children: React.ReactNode;
}

const WordOption: FC<IWordProps> = ({
  showOptions,
  setShowOptions,
  option,
  children,
}) => {
  return (
    <Box
      onMouseLeave={() =>
        setShowOptions((prev) => ({ ...prev, [option]: false }))
      }
      onMouseEnter={() =>
        setShowOptions((prev) => ({ ...prev, [option]: true }))
      }
      sx={{
        visibility: showOptions[option] ? 'visible' : 'hidden',
        opacity: showOptions[option] ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
      }}
    >
      {children}
    </Box>
  );
};

export default WordOption;
