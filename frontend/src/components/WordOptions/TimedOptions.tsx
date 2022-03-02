import React, { FC, useContext } from 'react';
import { InputContext, ThemeContext, WordListContext } from 'providers';
import { useFocus } from 'hooks';
import useWordOptionTheme from './styles';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import WordTypeOptions from './WordTypeOptions';
import { IOptionProps } from './types';

const options = [15, 30, 60, 120, 'endless'] as const;

const TimedOptions: FC<IOptionProps> = ({ setNeedReset }) => {
  const { timeOption, setTimeOption } = useContext(InputContext);
  const { textColor } = useContext(ThemeContext);
  const { setWordCount } = useContext(WordListContext);

  const { optionContainerStyle, getOptionStyle, getOptionTypographyStyle } =
    useWordOptionTheme('timed');

  const focus = useFocus();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <WordTypeOptions type="timed" />
      <div style={{ display: 'flex' }}>
        {options.map((option, idx) => (
          <div style={optionContainerStyle} key={'quotesbox' + idx}>
            <Box
              sx={getOptionStyle(option === timeOption)}
              onClick={(e) => {
                e.stopPropagation();
                if (option === 'endless') {
                  setWordCount(option);
                }
                setTimeOption(option);
                setNeedReset(true);
              }}
            >
              <Typography
                sx={{
                  ...getOptionTypographyStyle(option === timeOption),
                  fontSize: option === 'endless' ? '1.5rem' : '1rem',
                }}
              >
                {option !== 'endless' ? option : String.fromCharCode(8734)}
              </Typography>
            </Box>
            <Box
              sx={{ color: textColor, cursor: 'default' }}
              key={'quotesbox' + option}
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

export default TimedOptions;
