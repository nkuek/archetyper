import React, { useContext } from 'react';
import { TimeContext, WordContext } from 'providers';
import { useLocalStorage } from 'hooks';
import useWordOptionTheme from './styles';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';

const options = [30, 60, 120] as const;

const TimedOptions = () => {
  const { setTimer, timer } = useContext(TimeContext);
  const { textFieldRef } = useContext(WordContext);
  const { setLocalStorage } = useLocalStorage('typer-time');
  const { optionContainerStyle, getOptionStyle, optionTypographyStyle } =
    useWordOptionTheme('timed');
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        alignItems: 'flex-end',
      }}
    >
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'quotesbox' + idx}>
          <Box
            sx={getOptionStyle(!timer.id && option === timer.time)}
            onClick={(e) => {
              e.stopPropagation();
              setTimer({ id: null, time: option, countdown: true });
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

export default TimedOptions;
