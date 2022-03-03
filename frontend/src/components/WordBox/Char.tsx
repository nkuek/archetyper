import React, { FC, useContext, useEffect, useRef } from 'react';
import { Box } from '@mui/system';
import { ThemeContext, IndexContext, WordListContext } from 'providers';
import { TWordChar } from 'providers/WordListProvider';

interface IProps {
  charIdx: number;
  char: TWordChar;
  wordIdx: number;
}

const Char: FC<IProps> = (props) => {
  const { charIdx, char, wordIdx } = props;
  const { charList } = useContext(WordListContext);
  const { userWordIndex, currentCharIndex, setCaretSpacing } =
    useContext(IndexContext);
  const { theme } = useContext(ThemeContext);

  const displayExtraChar =
    wordIdx === userWordIndex &&
    charIdx >= charList[userWordIndex].length - 1 &&
    charIdx === currentCharIndex - 1 &&
    currentCharIndex >= charList[userWordIndex].length - 1;

  const currentChar = wordIdx === userWordIndex && charIdx === currentCharIndex;

  const charRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!charRef.current) return;
    setCaretSpacing({
      top: charRef.current.offsetTop,
      left:
        charRef.current.offsetLeft +
        (displayExtraChar ? charRef.current.offsetWidth + 2 : 0),
    });
  }, [displayExtraChar, currentCharIndex, userWordIndex, setCaretSpacing]);

  useEffect(() => {
    if (!charRef.current) return;
    charRef.current.scrollIntoView({ block: 'center' });
  }, [userWordIndex]);

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
