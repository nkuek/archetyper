import { Container } from '@mui/material';
import React from 'react';
import KeyRow from './KeyRow';
import rows from './rows.json';

const HeatMap = () => {
  return (
    <Container>
      <KeyRow keys={rows.row1} />
    </Container>
  );
};

export default HeatMap;
