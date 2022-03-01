import { Box, Container } from '@mui/material';
import React, { FC } from 'react';
import Key from './Key';

interface IKey {
  primary: string;
  secondary?: string;
  modifier?: boolean;
  size?: number;
}

const KeyRow: FC<{ keys: IKey[] }> = ({ keys }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      {keys.map((key) => {
        const { primary, secondary, modifier, size = 1 } = key;
        return (
          <Box
            key={key.primary + 'key'}
            sx={{
              border: '1px solid black',
              margin: '.1rem',
              borderRadius: 1,
              boxSizing: 'border-box',
              paddingBottom: '.2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: modifier ? 'center' : 'normal',
              fontSize: secondary || modifier ? '1.2em' : '1.5em',
              width: 45 * size,
              height: 45,
            }}
          >
            {secondary && <Key keyProp={secondary} />}
            <Key keyProp={primary} />
          </Box>
        );
      })}
    </Box>
  );
};

export default KeyRow;
