import { Box } from '@mui/material';
import { ThemeContext } from 'providers';
import React, { FC, useContext } from 'react';
import { IKey } from './KeyRow';

const Key: FC<{ keyProp: IKey }> = ({ keyProp }) => {
  const { primary, secondary, modifier, size = 1 } = keyProp;
  const letterProps = { marginLeft: '.2rem', fontSize: '.8em' } as const;
  const { theme } = useContext(ThemeContext);
  return (
    <Box
      sx={{
        border: `1px solid ${theme.headings}`,
        color: theme.words,
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
      {secondary && <Box sx={letterProps}>{secondary}</Box>}
      <Box sx={letterProps}>{primary}</Box>
    </Box>
  );
};

export default Key;
