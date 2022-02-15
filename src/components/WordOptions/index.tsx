import { useMemo, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useLocalStorage, useReset } from 'hooks';
import { IOptions } from './types';

const categories = ['words', 'quotes', 'timed'] as const;

const WordOptions = () => {
  const { wpm, setSettings, settings, textFieldRef } = useContext(WordContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);
  const { setLocalStorage } = useLocalStorage('typer-settings');

  const [showOptions, setShowOptions] = useState(
    categories.reduce(
      (categoryObj, category) => ({ ...categoryObj, [category]: false }),
      {} as IOptions
    )
  );

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
        height: 64,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <WordCountOptions
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
          {categories.map((option) => (
            <Typography
              onClick={(e) => {
                e.stopPropagation();
                setSettings((prev) => ({ ...prev, type: option }));
                setLocalStorage({ ...settings, type: option });
                setShowOptions((prev) => ({ ...prev, [option]: true }));
                if (textFieldRef.current) textFieldRef.current.focus();
              }}
              onMouseEnter={() => {
                if (settings.type === option)
                  setShowOptions((prev) => ({ ...prev, [option]: true }));
              }}
              onMouseLeave={() =>
                setShowOptions((prev) => ({ ...prev, [option]: false }))
              }
              sx={{
                margin: '0 .5em',
                color: option === settings.type ? theme.currentWord : textColor,
                opacity: option === settings.type ? 1 : 0.6,
                cursor: 'pointer',
              }}
              key={option}
            >
              {option}
            </Typography>
          ))}
        </Box>
      </Box>
      <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
        <Typography sx={{ color: textColor, marginRight: '.25em' }}>
          {'wpm: '}
        </Typography>
        <Typography sx={{ color: textColor }}>{wpm.net || ''}</Typography>
      </div>
    </Container>
  );
};

export default WordOptions;
