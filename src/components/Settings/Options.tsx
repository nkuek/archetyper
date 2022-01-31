import React, { useContext } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { WordContext } from 'providers';

const options = [
  { name: 'capital letters', value: 'capitalChars' },
  { name: 'special characters', value: 'specialChars' },
];

const Options = () => {
  const { settings, setSettings } = useContext(WordContext);

  const handleChange = (checked: boolean, option: string) => {
    setSettings((prev) => ({ ...prev, [option]: checked }));
  };

  return (
    <FormGroup>
      <Typography sx={{ fontSize: '1.25rem', marginBottom: '.5em' }}>
        options
      </Typography>
      {options.map((option) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={settings[option.value as keyof typeof settings]}
              sx={{ color: 'inherit', '&.Mui-checked': { color: 'inherit' } }}
            />
          }
          label={`${option.name}?`}
          key={option.name}
          sx={{ margin: 0 }}
          value={option.value}
          onChange={(_, checked) => handleChange(checked, option.value)}
        />
      ))}
    </FormGroup>
  );
};

export default Options;
