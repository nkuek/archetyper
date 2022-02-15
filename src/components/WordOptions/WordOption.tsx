import React, { FC } from 'react';
import { TReactSetState } from 'providers/general/types';
import { ICategories } from '.';
import { Box } from '@mui/system';

interface IProps {
  showOptions: ICategories;
  setShowOptions: TReactSetState<ICategories>;
  option: keyof ICategories;
  children: React.ReactNode;
}

const WordOption: FC<IProps> = ({
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
