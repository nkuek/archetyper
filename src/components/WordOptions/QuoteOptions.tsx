import React, { useContext } from 'react';
import { WordContext, WordListContext } from 'providers';
import useWordOptionTheme from './styles';
import { useLocalStorage } from 'hooks';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const options = ['short', 'medium', 'long'] as const;

const QuoteOptions = () => {
  const { setQuoteParams, quoteParams } = useContext(WordListContext);
  const { textFieldRef } = useContext(WordContext);
  const { optionContainerStyle, getOptionStyle, optionTypographyStyle } =
    useWordOptionTheme('quotes');
  const { setLocalStorage } = useLocalStorage('typer-quote-length');

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
              textFieldRef.current?.focus();
            }}
          >
            <Typography sx={optionTypographyStyle}>{option}</Typography>
          </Box>
        </div>
      ))}
    </div>
  );
};

export default QuoteOptions;
