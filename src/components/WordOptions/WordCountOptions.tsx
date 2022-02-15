import React, { useContext, useMemo } from 'react';
import { useLocalStorage, useReset } from 'hooks';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { wordOptions } from 'providers/WordProvider';
import useWordOptionTheme from './styles';

const options = [10, 25, 50, 'endless'] as const;

const WordCountOptions = () => {
  const reset = useReset(true);
  const { settings, setSettings, textFieldRef } = useContext(WordContext);

  const { setLocalStorage } = useLocalStorage('typer-word-count');

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const { setWordCount, wordCount } = useContext(WordListContext);

  const { optionTypographyStyle, optionContainerStyle, getOptionStyle } =
    useWordOptionTheme('words');

  return (
    <>
      <div style={{ display: 'flex' }}>
        {wordOptions.map((setting, idx) => (
          <div style={optionContainerStyle} key={setting.value + idx}>
            <Box
              sx={{
                display: 'flex',
                ...getOptionStyle(settings[setting.value]),
              }}
              onClick={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  [setting.value]: !prev[setting.value],
                }));
                reset(e);
              }}
            >
              {setting.name}
            </Box>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {options.map((option, idx) => (
          <div style={optionContainerStyle} key={'wordsbox' + idx}>
            <Box
              sx={getOptionStyle(option === wordCount)}
              onClick={(e) => {
                e.stopPropagation();
                setWordCount(option);
                setLocalStorage(option);
                reset(e);
              }}
            >
              <Typography
                sx={{
                  fontSize: option === 'endless' ? '1.5rem' : '1rem',
                  ...optionTypographyStyle,
                }}
              >
                {option !== 'endless' ? option : String.fromCharCode(8734)}
              </Typography>
            </Box>
            <Box
              sx={{ color: textColor, cursor: 'default' }}
              key={'spacer' + idx}
              onClick={(e) => {
                e.stopPropagation();
                textFieldRef.current?.focus();
              }}
            >
              {idx !== options.length - 1 && '/'}
            </Box>
          </div>
        ))}
      </div>
    </>
  );
};

export default WordCountOptions;
