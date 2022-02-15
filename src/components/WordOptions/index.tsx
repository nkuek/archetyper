import { useMemo, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useLocalStorage } from 'hooks';
import QuoteOptions from './QuoteOptions';
import WordOption from './WordOption';

const categories = ['words', 'quotes', 'timed'] as const;

const WordOptions = () => {
  const { wpm, setSettings, settings, textFieldRef } = useContext(WordContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);
  const { setLocalStorage } = useLocalStorage('typer-settings');

  const [showOptions, setShowOptions] = useState(false);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <WordOption setShowOptions={setShowOptions} showOptions={showOptions}>
          {settings.type === 'quotes' && <QuoteOptions />}
          {settings.type === 'words' && <WordCountOptions />}
        </WordOption>
        <Box sx={{ display: 'flex' }}>
          {categories.map((option) => (
            <Typography
              onClick={(e) => {
                e.stopPropagation();
                setSettings((prev) => ({ ...prev, type: option }));
                setLocalStorage({ ...settings, type: option });
                setShowOptions(true);
                if (textFieldRef.current) textFieldRef.current.focus();
              }}
              onMouseEnter={() => {
                if (settings.type === option) setShowOptions(true);
              }}
              onMouseLeave={() => setShowOptions(false)}
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
