import React, { useContext } from 'react';
import { Typography } from '@mui/material';
import { InputContext, ThemeContext } from 'providers';

const Wpm = () => {
  const { textColor } = useContext(ThemeContext);
  const { wpm } = useContext(InputContext);

  return (
    <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
      <Typography
        sx={{
          color: textColor,
          marginLeft: '.5em',
          marginRight: '.25em',
          fontWeight: 'bold',
        }}
      >
        {'wpm: '}
      </Typography>
      <Typography sx={{ color: textColor, fontWeight: 'bold' }}>
        {wpm.net || ''}
      </Typography>
    </div>
  );
};

export default Wpm;
