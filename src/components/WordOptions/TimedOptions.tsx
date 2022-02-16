import React, { useContext } from 'react';
import { ThemeContext, TimeContext } from 'providers';
import { useFocus, useLocalStorage } from 'hooks';
import useWordOptionTheme from './styles';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const options = [30, 60, 120, 180] as const;

const TimedOptions = () => {
  const { setTimer, timer } = useContext(TimeContext);
  const { textColor } = useContext(ThemeContext);
  const { setLocalStorage } = useLocalStorage('typer-time');
  const { optionContainerStyle, getOptionStyle, getOptionTypographyStyle } =
    useWordOptionTheme('timed');

  const focus = useFocus();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'flex-end',
        width: '100%',
      }}
    >
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'quotesbox' + idx}>
          <Box
            sx={getOptionStyle(option === timer._time)}
            onClick={(e) => {
              e.stopPropagation();
              setTimer({
                id: null,
                time: option,
                _time: option,
                countdown: true,
              });
              setLocalStorage(option);
              focus();
            }}
          >
            <Typography sx={getOptionTypographyStyle(option === timer._time)}>
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

export default TimedOptions;
