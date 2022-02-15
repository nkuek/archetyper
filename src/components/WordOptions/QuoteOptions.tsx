import React, { useContext } from 'react';
import { WordListContext } from 'providers';
import useWordOptionTheme from './styles';
import { useLocalStorage, useReset } from 'hooks';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const options = ['short', 'medium', 'long'] as const;

const QuoteOptions = () => {
  const { setQuoteParams, quoteParams } = useContext(WordListContext);
  const { optionContainerStyle, getOptionStyle, getOptionTypography } =
    useWordOptionTheme('quotes');
  const { setLocalStorage } = useLocalStorage('typer-quote-length');

  const reset = useReset(true);

  return (
    <div style={{ display: 'flex', height: '100%', alignItems: 'flex-end' }}>
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'quotesbox' + idx}>
          <Box
            sx={getOptionStyle(option === quoteParams)}
            onClick={(e) => {
              e.stopPropagation();
              setQuoteParams(option);
              setLocalStorage(option);
              reset(e);
            }}
          >
            <Typography sx={getOptionTypography(option === quoteParams)}>
              {option}
            </Typography>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default QuoteOptions;
