import { Container } from '@mui/material';
import React from 'react';
import KeyRow from './KeyRow';
import rows from './rows.json';

const HeatMap = () => {
  return (
    <Container sx={{ width: { xs: '100%', md: 'auto' }, margin: '0 auto' }}>
      {Object.values(rows).map((row, idx) => (
        <KeyRow key={'row' + idx} keys={row} />
      ))}
    </Container>
  );
};

export default HeatMap;
