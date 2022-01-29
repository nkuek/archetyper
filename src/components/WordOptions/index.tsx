import { useMemo, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { WordContext } from 'providers/WordProvider';
import { ThemeContext } from 'providers';
import { useReset } from 'hooks';

const WordOptions = () => {
  const values = useContext(WordContext);
  const { wpm, setWordCount, wordCount, setFocused } = values;

  const reset = useReset(false);

  const { theme } = useContext(ThemeContext);

  const options = useMemo(() => [10, 25, 50], []);
  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Container sx={{ display: 'flex', padding: 0, marginBottom: '.5em' }}>
        {options.map((option, idx) => (
          <Fragment key={'box' + idx}>
            <Box
              sx={{
                margin: '0em .5em',
                marginLeft: idx === 0 ? '0' : '.5em',
                cursor: 'pointer',
                borderBottom:
                  option === wordCount ? `1px solid ${textColor}` : 'none',
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
              {option}
            </Box>
            <Box sx={{ color: textColor }} key={'spacer' + idx}>
              {idx !== options.length - 1 && '/'}
            </Box>
          </Fragment>
        ))}
      </Container>
      <Box sx={{ color: textColor }}>{'WPM: '}</Box>
      <Box sx={{ color: textColor }}>{wpm || ''}</Box>
    </Container>
  );
};

export default WordOptions;
