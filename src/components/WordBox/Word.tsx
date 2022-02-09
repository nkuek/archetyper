import React, { FC, useContext } from 'react';
import { Box } from '@mui/system';
import { ThemeContext, WordContext } from 'providers';
import { IChars } from '.';
import Char from './Char';

interface IProps {
  wordIdx: number;
  word: IChars;
}

const Word: FC<IProps> = (props) => {
  const { wordIdx, word } = props;
  const { theme } = useContext(ThemeContext);
  const { currentWordIndex, wordRef } = useContext(WordContext);

  return (
    <Box
      color={wordIdx === currentWordIndex ? theme.currentWord : theme.words}
      key={wordIdx}
      sx={{
        display: 'flex',
        margin: '0.25em',
        textDecoration: word.skipped
          ? `underline ${theme.incorrect || 'red'}`
          : 'none',
      }}
      ref={currentWordIndex === wordIdx ? wordRef : null}
    >
      {word.chars.map((char, charIdx) => (
        <Char
          key={`${char.char}${charIdx}`}
          wordIdx={wordIdx}
          char={char}
          charIdx={charIdx}
        />
      ))}
    </Box>
  );
};

export default Word;
