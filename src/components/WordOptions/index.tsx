import { useMemo, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';

const categories = ['words', 'quotes', 'timed'] as const;

const WordOptions = () => {
  const values = useContext(WordContext);
  const { wpm, settings } = values;

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const [category, setCategory] = useState();

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '.5em',
      }}
    >
      <Box>
        <Box>
          {categories.map((category) => (
            <Typography key={category}>{category}</Typography>
          ))}
        </Box>
        <WordCountOptions />
      </Box>
      <div style={{ display: 'flex', alignSelf: 'flex-end' }}>
        <Box sx={{ color: textColor, marginRight: '.25em' }}>{'wpm: '}</Box>
        <Box sx={{ color: textColor }}>{wpm.net || ''}</Box>
      </div>
    </Container>
  );
};

export default WordOptions;
