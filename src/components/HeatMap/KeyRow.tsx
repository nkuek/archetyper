import { Box } from '@mui/material';
import React, { FC } from 'react';
import Key from './Key';

export interface IKey {
  primary: string;
  secondary?: string;
  modifier?: boolean;
  size?: number;
}

const KeyRow: FC<{ keys: IKey[] }> = ({ keys }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {keys.map((key, idx) => (
        <Key key={key + 'key' + idx} keyProp={key} />
      ))}
    </Box>
  );
};

export default KeyRow;
