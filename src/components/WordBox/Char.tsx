import React, { FC, useCallback, useContext } from 'react';
import { Box } from '@mui/system';
import { ThemeContext, IndexContext, WordListContext } from 'providers';
import { TWordChar } from '.';

interface IProps {
  charIdx: number;
  char: TWordChar;
  wordIdx: number;
}

const Char: FC<IProps> = (props) => {
  const { charIdx, char, wordIdx } = props;
  const { wordList } = useContext(WordListContext);
  const { currentWordIndex, currentCharIndex, setCaretSpacing } =
    useContext(IndexContext);
  const { theme } = useContext(ThemeContext);

  const displayExtraChar =
    wordIdx === currentWordIndex &&
    charIdx >= wordList[currentWordIndex].length - 1 &&
    charIdx === currentCharIndex - 1 &&
    currentCharIndex >= wordList[currentWordIndex].length - 1;

  const currentChar =
    wordIdx === currentWordIndex && charIdx === currentCharIndex;

  const charRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setCaretSpacing({
          top: node.offsetTop,
          left: node.offsetLeft + (displayExtraChar ? node.offsetWidth + 2 : 0),
        });
      }
    },
    [setCaretSpacing, displayExtraChar]
  );

  return (
    <Box
      color={
        (char.correct !== null && !char.correct) || char.extra
          ? theme.incorrect || 'red'
          : char.correct
          ? theme.correct
          : 'inherit'
      }
      ref={currentChar || displayExtraChar ? charRef : null}
    >
      {char.char}
    </Box>
  );
};

export default Char;
