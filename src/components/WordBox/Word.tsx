import React, { FC, useContext } from 'react';
import { Box } from '@mui/system';
import {
  IndexContext,
  ThemeContext,
  WordContext,
  WordListContext,
} from 'providers';
import Char from './Char';
import { IChars } from 'providers/WordListProvider';

interface IProps {
  wordIdx: number;
  word: IChars;
}

const Word: FC<IProps> = (props) => {
  const { wordIdx, word } = props;
  const { theme } = useContext(ThemeContext);
  const { currentWordIndex } = useContext(IndexContext);
  const { wordRef, lastWordRef } = useContext(WordContext);
  const { charList } = useContext(WordListContext);

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
        flexWrap: 'wrap',
      }}
      className="word"
      ref={
        currentWordIndex === wordIdx
          ? wordRef
          : wordIdx === Object.keys(charList).length - 1
          ? lastWordRef
          : null
      }
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
