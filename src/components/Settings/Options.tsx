import { CheckBox } from '@mui/icons-material';
import {
  Container,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import React from 'react';

const options = ['capital letters', 'special characters'];

const Options = () => {
  return (
    <FormGroup>
      <Typography sx={{ fontSize: '1.25rem', marginBottom: '.5em' }}>
        options
      </Typography>
      {options.map((option) => (
        <FormControlLabel
          control={<CheckBox />}
          label={`${option}?`}
          key={option}
          sx={{ margin: 0 }}
        />
      ))}
    </FormGroup>
  );
};

export default Options;
