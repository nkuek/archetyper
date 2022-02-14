import React, { useContext, useMemo } from 'react';
import { useLocalStorage, useReset } from 'hooks';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const options = [10, 25, 50, 'endless'] as const;
const WordCountOptions = () => {
  const reset = useReset(true);
  const { setLocalStorage } = useLocalStorage('typer-word-count');

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const { settings } = useContext(WordContext);
  const { setWordCount, wordCount } = useContext(WordListContext);

  return (
    <div style={{ display: 'flex', padding: 0, alignItems: 'center' }}>
      {options.map((option, idx) => (
        <div
          style={{
            display: 'flex',
            opacity: settings.quotes ? 0 : 1,
            visibility: settings.quotes ? 'hidden' : 'visible',
            transition: 'opacity 200ms ease-in-out, visibility 200ms linear',
          }}
          key={'box' + idx}
        >
          <Box
            sx={{
              padding: '0em .5em',
              cursor: 'pointer',
              color: option === wordCount ? theme.currentWord : textColor,
              opacity: option === wordCount ? 1 : 0.6,
              transition: 'opacity 200ms ease-in-out',
              '&:hover': {
                opacity: 1,
              },
            }}
            key={`${option}${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              setWordCount(option);
              reset(e);
              setLocalStorage(option);
            }}
          >
            <Typography
              sx={{
                fontSize: option === 'endless' ? '1.5rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 'normal',
                height: 20,
                boxSizing: 'border-box',
                fontWeight: 'bold',
                borderBottom: option === wordCount ? '1px solid' : 'none',
                borderColor: 'inherit',
                marginBottom: option !== wordCount ? '1px' : 0,
              }}
            >
              {option !== 'endless' ? option : String.fromCharCode(8734)}
            </Typography>
          </Box>
          <Box sx={{ color: textColor }} key={'spacer' + idx}>
            {idx !== options.length - 1 && '/'}
          </Box>
        </div>
      ))}
    </div>
  );
};

export default WordCountOptions;
