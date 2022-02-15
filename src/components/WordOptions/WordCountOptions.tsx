import React, { FC, useContext, useMemo } from 'react';
import { useLocalStorage, useReset } from 'hooks';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { wordOptions } from 'providers/WordProvider';
import { TReactSetState } from 'providers/general/types';
import { ICategories } from '.';
import WordOption from './WordOption';

const options = [10, 25, 50, 'endless'] as const;

interface IProps {
  showOptions: ICategories;
  setShowOptions: TReactSetState<ICategories>;
}

const WordCountOptions: FC<IProps> = ({ showOptions, setShowOptions }) => {
  const reset = useReset(true);
  const { setLocalStorage } = useLocalStorage('typer-word-count');

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const { settings, setSettings } = useContext(WordContext);
  const { setWordCount, wordCount } = useContext(WordListContext);

  const optionContainerStyle = {
    display: 'flex',
    opacity: settings.quotes ? 0 : 1,
    visibility: settings.quotes ? 'hidden' : 'visible',
    transition: 'opacity 200ms ease-in-out, visibility 200ms linear',
  } as const;

  const optionStyle = (condition: boolean) => ({
    padding: '0em .5em',
    cursor: 'pointer',
    color: condition ? theme.currentWord : textColor,
    opacity: condition ? 1 : 0.6,
    transition: 'opacity 200ms ease-in-out',
    '&:hover': {
      opacity: 1,
    },
  });

  return (
    <WordOption
      setShowOptions={setShowOptions}
      showOptions={showOptions}
      option="words"
    >
      <div style={{ display: 'flex' }}>
        {wordOptions.map((setting, idx) => (
          <div style={optionContainerStyle} key={setting.value + idx}>
            <Box
              sx={{
                display: 'flex',
                ...optionStyle(settings[setting.value]),
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
      </div>
      <div
        style={{
          display: 'flex',
          padding: 0,
        }}
      >
        <div style={{ display: 'flex' }}>
          {options.map((option, idx) => (
            <div style={optionContainerStyle} key={'box' + idx}>
              <Box
                sx={optionStyle(option === wordCount)}
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
        </div>
      </div>
    </WordOption>
  );
};

export default WordCountOptions;
