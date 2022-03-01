import { Box } from '@mui/material';
import React, { FC } from 'react';

const Key: FC<{ keyProp: string }> = ({ keyProp }) => {
  return (
    <Box
      sx={{
        marginLeft: '.2rem',
        fontSize: '.8em',
      }}
    >
      {keyProp}
    </Box>
  );
};

export default Key;
