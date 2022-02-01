import React, { useContext } from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { WordContext } from 'providers';
import { defaultSettings, options } from 'providers/WordProvider';
import randomizeWords from 'words';
import { WordListContext } from 'providers/WordListProvider';

const Options = () => {
  const { setWordList } = useContext(WordListContext);
  const { settings, setSettings } = useContext(WordContext);

  const handleChange = (checked: boolean, option: string) => {
    let newSettings = { ...settings, [option]: checked };
    if (option === 'quotes' && checked) {
      newSettings = { ...defaultSettings, quotes: true };
    }
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
              sx={{
                color: 'inherit',
                '&.Mui-checked': { color: 'inherit' },
                '&.Mui-disabled': {
                  color: 'inherit',
                  filter: 'brightness(60%)',
                },
              }}
              disabled={option.value !== 'quotes' && settings.quotes}
            />
          }
          label={`${option.name}?`}
          key={option.name}
          sx={{
            margin: 0,
            color: 'inherit',
          }}
          componentsProps={{
            typography: {
              sx: {
                '&.Mui-disabled': {
                  color: 'inherit !important',
                  filter: 'brightness(60%)',
                  cursor: 'not-allowed',
                },
              },
            },
          }}
          value={option.value}
          onChange={(_, checked) => handleChange(checked, option.value)}
        />
      ))}
    </FormGroup>
  );
};

export default Options;
