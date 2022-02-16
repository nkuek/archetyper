import { useContext } from 'react';
import { WordListContext } from 'providers';
import useWordOptionTheme from './styles';
import { useFocus, useLocalStorage } from 'hooks';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const options = ['short', 'medium', 'long'] as const;

const QuoteOptions = () => {
  const { setQuoteParams, quoteParams } = useContext(WordListContext);
  const { optionContainerStyle, getOptionStyle, getOptionTypographyStyle } =
    useWordOptionTheme('quotes');
  const { setLocalStorage } = useLocalStorage('typer-quote-length');
  const focus = useFocus();

  return (
    <>
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'quotesbox' + idx}>
          <Box
            sx={getOptionStyle(option === quoteParams)}
            onClick={(e) => {
              e.stopPropagation();
              setQuoteParams(option);
              setLocalStorage(option);
              focus();
            }}
          >
            <Typography sx={getOptionTypographyStyle(option === quoteParams)}>
              {option}
            </Typography>
          </Box>
        </div>
      ))}
    </>
  );
};

export default QuoteOptions;
