import { useMemo, useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useLocalStorage, useReset } from 'hooks';
import QuoteOptions from './QuoteOptions';
import WordOption from './WordOption';
import TimedOptions from './TimedOptions';

const categories = ['words', 'timed', 'quotes'] as const;

const WordOptions = () => {
  const { wpm, setSettings, settings } = useContext(WordContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);
  const { setLocalStorage } = useLocalStorage('typer-settings');

  const [showOptions, setShowOptions] = useState(false);
  const [needReset, setNeedReset] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: typeof categories[number]
  ) => {
    e.stopPropagation();
    setSettings((prev) => ({ ...prev, type: option }));
    setLocalStorage({ ...settings, type: option });
    setShowOptions(true);
    setNeedReset(true);
  };

  const reset = useReset({ resetState: true });

  useEffect(() => {
    if (needReset) {
      reset();
      setNeedReset(false);
    }
  }, [needReset]);

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
          position: 'relative',
        }}
      >
        <WordOption showOptions={showOptions} setShowOptions={setShowOptions}>
          <QuoteOptions />
          <WordCountOptions />
          <TimedOptions />
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
      <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
        <Typography
          sx={{ color: textColor, marginRight: '.25em', fontWeight: 'bold' }}
        >
          {'wpm: '}
        </Typography>
        <Typography sx={{ color: textColor, fontWeight: 'bold' }}>
          {wpm.net || ''}
        </Typography>
      </div>
    </Container>
  );
};

export default WordOptions;
