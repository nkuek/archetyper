import { useContext } from 'react';
import { useFocus, useLocalStorage } from 'hooks';
import { ThemeContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import useWordOptionTheme from './styles';
import WordTypeOptions from './WordTypeOptions';

const options = [10, 25, 50, 'endless'] as const;

const WordCountOptions = () => {
  const { textColor } = useContext(ThemeContext);

  const { setWordCount, wordCount } = useContext(WordListContext);

  const { setLocalStorage } = useLocalStorage('typer-word-count');

  const { getOptionTypographyStyle, optionContainerStyle, getOptionStyle } =
    useWordOptionTheme('words');

  const focus = useFocus();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <WordTypeOptions type="words" />
      <div style={{ display: 'flex' }}>
        {options.map((option, idx) => (
          <div style={optionContainerStyle} key={'wordsbox' + idx}>
            <Box
              sx={getOptionStyle(option === wordCount)}
              onClick={(e) => {
                e.stopPropagation();
                setWordCount(option);
                setLocalStorage(option);
                focus();
              }}
            >
              <Typography
                sx={{
                  fontSize: option === 'endless' ? '1.5rem' : '1rem',
                  ...getOptionTypographyStyle(option === wordCount),
                }}
              >
                {option !== 'endless' ? option : String.fromCharCode(8734)}
              </Typography>
            </Box>
            <Box
              sx={{ color: textColor, cursor: 'default' }}
              key={'spacer' + option}
              onClick={(e) => {
                e.stopPropagation();
                focus();
              }}
            >
              {idx !== options.length - 1 && '/'}
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordCountOptions;
