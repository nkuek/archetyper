import { useMemo, useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { ThemeContext, WordContext } from 'providers';
import WordCountOptions from './WordCountOptions';
import { Typography } from '@mui/material';
import { useLocalStorage, useReset } from 'hooks';

const categories = ['words', 'quotes', 'timed'] as const;

export interface ICategories {
  words: boolean;
  quotes: boolean;
  timed: boolean;
}

const WordOptions = () => {
  const values = useContext(WordContext);
  const { wpm } = values;

  const { theme } = useContext(ThemeContext);
  const reset = useReset();

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);
  const { value: LSCategory, setLocalStorage } = useLocalStorage(
    'typer-word-category',
    'words'
  );

  const [category, setCategory] = useState(LSCategory);
  const [showOptions, setShowOptions] = useState(
    categories.reduce(
      (categoryObj, category) => ({ ...categoryObj, [category]: false }),
      {} as ICategories
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
                setCategory(option);
                setLocalStorage(option);
                setShowOptions((prev) => ({ ...prev, [option]: true }));
                reset(e);
              }}
              onMouseEnter={() => {
                if (category === option)
                  setShowOptions((prev) => ({ ...prev, [option]: true }));
              }}
              onMouseLeave={() =>
                setShowOptions((prev) => ({ ...prev, [option]: false }))
              }
              sx={{
                margin: '0 .5em',
                color: option === category ? theme.currentWord : textColor,
                opacity: option === category ? 1 : 0.6,
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
        <Box sx={{ color: textColor, marginRight: '.25em' }}>{'wpm: '}</Box>
        <Box sx={{ color: textColor }}>{wpm.net || ''}</Box>
      </div>
    </Container>
  );
};

export default WordOptions;
