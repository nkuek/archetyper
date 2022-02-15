import React, { FC, useContext, useMemo } from 'react';
import { useLocalStorage, useReset } from 'hooks';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { wordOptions } from 'providers/WordProvider';
import { IProps } from './types';
import WordOption from './WordOption';
import useWordOptionTheme from './styles';

const options = [10, 25, 50, 'endless'] as const;

const SecondaryOptions = () => {
  const { settings, setSettings } = useContext(WordContext);

  const { optionContainerStyle, getOptionStyle } = useWordOptionTheme('words');
  const reset = useReset(true);

  return (
    <>
      {wordOptions.map((setting, idx) => (
        <div style={optionContainerStyle} key={setting.value + idx}>
          <Box
            sx={{
              display: 'flex',
              ...getOptionStyle(settings[setting.value]),
            }}
            onClick={(e) => {
              setSettings((prev) => ({
                ...prev,
                [setting.value]: !prev[setting.value],
              }));
              reset(e);
            }}
          >
            {setting.name}
          </Box>
        </div>
      ))}
    </>
  );
};

const WordCountOptions: FC<IProps> = ({ showOptions, setShowOptions }) => {
  const reset = useReset(true);
  const { setLocalStorage } = useLocalStorage('typer-word-count');

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const { setWordCount, wordCount } = useContext(WordListContext);

  const { optionContainerStyle, getOptionStyle } = useWordOptionTheme('words');

  return (
    <WordOption
      setShowOptions={setShowOptions}
      showOptions={showOptions}
      optionKey="words"
      secondaryOptions={<SecondaryOptions />}
    >
      {options.map((option, idx) => (
        <div style={optionContainerStyle} key={'box' + idx}>
          <Box
            sx={getOptionStyle(option === wordCount)}
            key={`${option}${idx}`}
            onClick={(e) => {
              e.stopPropagation();
              setWordCount(option);
              reset(e);
              setLocalStorage(option);
            }}
          >
            <Typography
              sx={{
                fontSize: option === 'endless' ? '1.5rem' : '1rem',
                display: 'flex',
                alignItems: 'center',
                lineHeight: 'normal',
                height: 20,
                boxSizing: 'border-box',
                fontWeight: 'bold',
                borderBottom: option === wordCount ? '1px solid' : 'none',
                borderColor: 'inherit',
                marginBottom: option !== wordCount ? '1px' : 0,
              }}
            >
              {option !== 'endless' ? option : String.fromCharCode(8734)}
            </Typography>
          </Box>
          <Box sx={{ color: textColor }} key={'spacer' + idx}>
            {idx !== options.length - 1 && '/'}
          </Box>
        </div>
      ))}
    </WordOption>
  );
};

export default WordCountOptions;
