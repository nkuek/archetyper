import { FC, useContext } from 'react';
import { ThemeContext, WordListContext } from 'providers';
import useWordOptionTheme from './styles';
import { useFocus, useLocalStorage } from 'hooks';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { IOptionProps } from './types';

const options = ['short', 'medium', 'long'] as const;

const QuoteOptions: FC<IOptionProps> = ({ setNeedReset }) => {
  const { setQuoteParams, quoteParams } = useContext(WordListContext);
  const { optionContainerStyle, getOptionStyle, getOptionTypographyStyle } =
    useWordOptionTheme('quotes');
  const { textColor } = useContext(ThemeContext);
  const { setLocalStorage } = useLocalStorage('typer-quote-length');
  const focus = useFocus();

  return (
    <div style={{ display: 'flex' }}>
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'quotesbox' + idx}>
          <Box
            sx={getOptionStyle(option === quoteParams)}
            onClick={(e) => {
              e.stopPropagation();
              setQuoteParams(option);
              setLocalStorage(option);
              setNeedReset(true);
            }}
          >
            <Typography sx={getOptionTypographyStyle(option === quoteParams)}>
              {option}
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
  );
};

export default QuoteOptions;
