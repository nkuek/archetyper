import { useMemo, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {
  ThemeContext,
  TimeContext,
  WordContext,
  WordListContext,
} from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useLocalStorage } from 'hooks';
import QuoteOptions from './QuoteOptions';
import WordOption from './WordOption';
import TimedOptions from './TimedOptions';

const categories = ['words', 'quotes', 'timed'] as const;

const WordOptions = () => {
  const { wpm, setSettings, settings, textFieldRef, setFocused } =
    useContext(WordContext);
  const { setWordCount } = useContext(WordListContext);
  const { setTimer } = useContext(TimeContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);
  const { setLocalStorage } = useLocalStorage('typer-settings');
  const { value: LSTime } = useLocalStorage('typer-time', 30);
  const { value: LSWordCount } = useLocalStorage('typer-word-count', 25);

  const [showOptions, setShowOptions] = useState(false);

  const handleClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    option: typeof categories[number]
  ) => {
    e.stopPropagation();
    setSettings((prev) => ({ ...prev, type: option }));
    setLocalStorage({ ...settings, type: option });
    setShowOptions(true);
    option === 'words' && setWordCount(LSWordCount);
    option === 'timed' &&
      settings.type !== 'timed' &&
      setTimer({
        id: null,
        time: LSTime,
        _time: LSTime,
        countdown: true,
      });
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setFocused(true);
    }
  };

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
        onMouseEnter={() => {
          setShowOptions(true);
        }}
        onMouseLeave={() => {
          setShowOptions(false);
        }}
      >
        <WordOption showOptions={showOptions}>
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
