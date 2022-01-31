import React, { useContext } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { WordContext } from 'providers';
import { options } from 'providers/WordProvider';
import randomizeWords from 'words';

const Options = () => {
  const { settings, setSettings, setWordList } = useContext(WordContext);

  const handleChange = (checked: boolean, option: string) => {
    const newSettings = { ...settings, [option]: checked };
    setSettings(newSettings);
    localStorage.setItem('typer-settings', JSON.stringify(newSettings));
    setWordList(randomizeWords(newSettings));
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
