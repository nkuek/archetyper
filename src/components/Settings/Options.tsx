import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import { ThemeContext, WordContext } from 'providers';
import { defaultSettings, options } from 'providers/WordProvider';
import { Box } from '@mui/system';

const Options = () => {
  const { settings, setSettings } = useContext(WordContext);
  const { theme } = useContext(ThemeContext);

  const [disableClear, setDisableClear] = useState(
    Object.keys(settings).every(
      (key) => !settings[key as keyof typeof settings]
    )
  );

  useEffect(() => {
    if (
      Object.keys(settings).every(
        (key) => !settings[key as keyof typeof settings]
      )
    ) {
      setTimeout(() => setDisableClear(true), 300);
    }
  }, [settings]);

  const handleChange = (checked: boolean, option: string) => {
    let newSettings = { ...settings, [option]: checked };
    if (option === 'quotes' && checked) {
      newSettings = { ...defaultSettings, quotes: true };
    }
    setSettings(newSettings);
    localStorage.setItem('typer-settings', JSON.stringify(newSettings));
    setDisableClear(false);
  };

  const clearSelection = () => {
    setSettings(defaultSettings);
    localStorage.setItem('typer-settings', JSON.stringify(defaultSettings));
  };

  return (
    <FormGroup>
      <Box sx={{ display: 'flex', marginBottom: '.5em' }}>
        <Typography sx={{ fontSize: '1.25rem', marginRight: '.75em' }}>
          options
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: theme.headings,
            borderColor: theme.headings,
            textTransform: 'lowercase',
            padding: '0 1.5em',
            '&:hover': {
              transition: 'all 150ms ease-in-out',
              filter: 'brightness(80%)',
              opacity: 0.8,
              borderColor: theme.headings,
            },
            '&.Mui-disabled': {
              transition: 'all 300ms ease-in-out',
              filter: 'brightness(60%)',
              borderColor: theme.disabled || theme.headings,
              color: theme.disabled || theme.headings,
            },
          }}
          disabled={disableClear}
          onClick={clearSelection}
        >
          clear all
        </Button>
      </Box>
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
