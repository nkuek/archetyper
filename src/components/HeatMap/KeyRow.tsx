import { Box, Container } from '@mui/material';
import React, { FC } from 'react';
import Key from './Key';

interface IKey {
  primary: string;
  secondary?: string;
}

const KeyRow: FC<{ keys: IKey[] }> = ({ keys }) => {
  return (
    <Container sx={{ display: 'flex' }}>
      {keys.map((key) => (
        <Box
          sx={{
            border: '1px solid black',
            margin: '.1em',
            borderRadius: 1,
            boxSizing: 'border-box',
            paddingRight: '1em',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {key.secondary && <Key keyProp={key.secondary} />}
          <Key keyProp={key.primary} />
        </Box>
      ))}
    </Container>
  );
};

export default KeyRow;
