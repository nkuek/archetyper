import { useContext, useMemo } from 'react';
import { useLocalStorage } from 'hooks';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { wordOptions } from 'providers/WordProvider';
import useWordOptionTheme from './styles';

const options = [10, 25, 50, 'endless'] as const;

const WordCountOptions = () => {
  const { settings, setSettings, textFieldRef, setFocused } =
    useContext(WordContext);

  const { theme } = useContext(ThemeContext);

  const textColor = useMemo(() => theme.wordsContrast || theme.words, [theme]);

  const { setWordCount, wordCount } = useContext(WordListContext);

  const { setLocalStorage } = useLocalStorage('typer-word-count');
  const { getOptionTypographyStyle, optionContainerStyle, getOptionStyle } =
    useWordOptionTheme('words');

  const focus = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setFocused(true);
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        {wordOptions.map((setting, idx) => (
          <div style={optionContainerStyle} key={setting.value + idx}>
            <Box
              sx={{
                display: 'flex',
                ...getOptionStyle(settings[setting.value]),
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSettings((prev) => ({
                  ...prev,
                  [setting.value]: !prev[setting.value],
                }));
                focus();
              }}
            >
              {setting.name}
            </Box>
          </div>
        ))}
      </div>
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
              key={'spacer' + idx}
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
    </>
  );
};

export default WordCountOptions;
