import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { languageMap } from 'languages/wordListGenerator';
import { SettingsContext, ThemeContext } from 'providers';
import React, { useContext } from 'react';
import SettingsWrapper from './SettingsWrapper';

const Languages = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { theme } = useContext(ThemeContext);
  return (
    <SettingsWrapper
      title="language"
      tooltip="language applied to word and timed tests"
    >
      <Select
        sx={{
          color: theme.headings,
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.headings,
            opacity: 0.8,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.headings,
            opacity: 1,
          },
        }}
        value={settings.language}
        onChange={(e) =>
          setSettings((prev) => ({
            ...prev,
            language: e.target.value as keyof typeof languageMap,
          }))
        }
      >
        {Object.keys(languageMap).map((language) => (
          <MenuItem key={language} value={language}>
            {language}
          </MenuItem>
        ))}
      </Select>
    </SettingsWrapper>
  );
};

export default Languages;
