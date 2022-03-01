import { Box } from '@mui/material';
import React, { FC } from 'react';

const Key: FC<{ keyProp: string }> = ({ keyProp }) => {
  return (
    <Box
      sx={{
        fontSize: '.8em',
        marginLeft: '.2em',
      }}
    >
      {keyProp}
    </Box>
  );
};

export default Key;
