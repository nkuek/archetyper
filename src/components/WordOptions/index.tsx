import { useMemo, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordListContext, WordContext } from 'providers';
import { useReset } from 'hooks';

const WordOptions = () => {
  const { setWordCount, wordCount } = useContext(WordListContext);
  const values = useContext(WordContext);
  const { wpm, setFocused, settings } = values;

  const reset = useReset(false);

  const { theme } = useContext(ThemeContext);

  const options = useMemo(() => [10, 25, 50], []);
  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
      }}
    >
      <div style={{ display: 'flex', padding: 0 }}>
        {options.map(
          (option, idx) =>
            !settings.quotes && (
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
            )
        )}
      </div>
      <div style={{ display: 'flex' }}>
        <Box sx={{ color: textColor, marginRight: '.25em' }}>{'wpm: '}</Box>
        <Box sx={{ color: textColor }}>{wpm || ''}</Box>
      </div>
    </Container>
  );
};

export default WordOptions;
