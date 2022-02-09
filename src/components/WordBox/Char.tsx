import { keyframes } from '@emotion/react';
import { Box } from '@mui/system';
import { ThemeContext, WordContext, WordListContext } from 'providers';
import React, { FC, useCallback, useContext, useState } from 'react';
import { TWordChar } from '.';

interface IProps {
  charIdx: number;
  char: TWordChar;
  wordIdx: number;
}

const animation = keyframes`
  50% {
    opacity: 0.25
  }
`;

const Char: FC<IProps> = ({ charIdx, char, wordIdx }) => {
  const { wordList } = useContext(WordListContext);
  const { currentWordIndex, currentCharIndex } = useContext(WordContext);
  const { theme } = useContext(ThemeContext);

  const charRef = useCallback((node: HTMLDivElement) => {
    if (node) setCaretSpacing(node.scrollWidth);
  }, []);

  const [caretSpacing, setCaretSpacing] = useState(0);

  const displayExtraChar =
    wordIdx === currentWordIndex &&
    charIdx >= wordList[currentWordIndex].length - 1 &&
    charIdx === currentCharIndex - 1 &&
    currentCharIndex >= wordList[currentWordIndex].length - 1;

  const currentChar =
    wordIdx === currentWordIndex && charIdx === currentCharIndex;

  const caretStyling = (condition: boolean) =>
    ({
      height: '1.5em',
      width: 3,
      top: -5,
      position: 'absolute',
      backgroundColor: theme.currentChar,
      display: condition ? 'initial' : 'none',
      visibility: condition ? 'visible' : 'hidden',
      animation: `${animation} 1.5s linear infinite`,
    } as const);
  return (
    <Box key={char.char + charIdx} sx={{ position: 'relative' }}>
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
      <Box
        sx={{
          ...caretStyling(currentChar),
          right: caretSpacing,
        }}
      ></Box>
      <Box
        sx={{
          ...caretStyling(displayExtraChar),
          left: caretSpacing,
          transformOrigin: 'top right',
        }}
      ></Box>
    </Box>
  );
};

export default Char;
