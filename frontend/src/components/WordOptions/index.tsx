import { useMemo, useContext, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { SettingsContext, ThemeContext, WordListContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useReset } from 'hooks';
import QuoteOptions from './QuoteOptions';
import WordOption from './WordOption';
import TimedOptions from './TimedOptions';
import Wpm from './Wpm';

const categories = ['words', 'timed', 'quotes'] as const;

const WordOptions = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { LSWordCount, setWordCount } = useContext(WordListContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const [showOptions, setShowOptions] = useState(false);
  const [needReset, setNeedReset] = useState(false);

  const handleClick = useCallback(
    (
      e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
      option: (typeof categories)[number]
    ) => {
      e.stopPropagation();
      setSettings((prev) => ({ ...prev, type: option }));
      if (option === 'words') setWordCount(LSWordCount);
      setShowOptions(true);
      setNeedReset(true);
    },
    [setSettings, setShowOptions, setNeedReset, LSWordCount, setWordCount]
  );

  const reset = useReset();

  useEffect(() => {
    if (needReset) {
      reset();
      setNeedReset(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needReset]);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
        flexWrap: 'wrap',
        padding: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        <WordOption showOptions={showOptions} setShowOptions={setShowOptions}>
          <QuoteOptions setNeedReset={setNeedReset} />
          <WordCountOptions setNeedReset={setNeedReset} />
          <TimedOptions setNeedReset={setNeedReset} />
        </WordOption>
        <Box sx={{ display: 'flex' }}>
          {categories.map((option) => (
            <Typography
              onClick={(e) => {
                handleClick(e, option);
              }}
              sx={{
                margin: '0 .5em',
                color:
                  option === settings.type
                    ? theme.wordsContrast || theme.currentWord
                    : textColor,
                opacity: option === settings.type ? 1 : 0.6,
                cursor: 'pointer',
                fontWeight: option === settings.type ? 'bold' : 'normal',
                '&:hover': {
                  opacity: 1,
                },
                transition: 'opacity 300ms ease-in-out',
              }}
              key={option}
              onMouseEnter={() => {
                if (option === settings.type) setShowOptions(true);
              }}
              onMouseLeave={() => {
                setShowOptions(false);
              }}
            >
              {option}
            </Typography>
          ))}
        </Box>
      </Box>
      <Wpm />
    </Container>
  );
};

export default WordOptions;
