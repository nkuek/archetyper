import { useMemo, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordListContext, WordContext } from 'providers';
import { useReset } from 'hooks';
import { Typography } from '@mui/material';

const WordOptions = () => {
  const { setWordCount, wordCount } = useContext(WordListContext);
  const values = useContext(WordContext);
  const { wpm, setFocused, settings } = values;

  const reset = useReset();

  const { theme } = useContext(ThemeContext);

  const options = useMemo(() => [10, 25, 50], []);
  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
        height: 25,
      }}
    >
      <div style={{ display: 'flex', padding: 0 }}>
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
                color: textColor,
              }}
              key={option + idx}
              onClick={(e) => {
                e.stopPropagation();
                setWordCount(option);
                reset(e);
                setFocused(true);
                localStorage.setItem(
                  'typer-word-count',
                  JSON.stringify(option)
                );
              }}
            >
              <Typography
                sx={{
                  borderBottom:
                    option === wordCount ? `1px solid ${textColor}` : 'none',
                }}
              >
                {option}
              </Typography>
            </Box>
            <Box sx={{ color: textColor }} key={'spacer' + idx}>
              {idx !== options.length - 1 && '/'}
            </Box>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <Box sx={{ color: textColor, marginRight: '.25em' }}>{'wpm: '}</Box>
        <Box sx={{ color: textColor }}>{wpm.gross || ''}</Box>
      </div>
    </Container>
  );
};

export default WordOptions;
