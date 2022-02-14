import React, { FC, useCallback, useContext } from 'react';
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
  const { charList, wordCount } = useContext(WordListContext);
  const { userWordIndex, currentCharIndex, setCaretSpacing } =
    useContext(IndexContext);
  const { theme } = useContext(ThemeContext);

  const displayExtraChar =
    wordIdx === userWordIndex &&
    charIdx >= charList[userWordIndex].length - 1 &&
    charIdx === currentCharIndex - 1 &&
    currentCharIndex >= charList[userWordIndex].length - 1;

  const currentChar = wordIdx === userWordIndex && charIdx === currentCharIndex;

  const charRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        setCaretSpacing({
          top: node.offsetTop,
          left: node.offsetLeft + (displayExtraChar ? node.offsetWidth + 2 : 0),
        });
        // setTimeout to update the node position after hiding previous words
        if (wordCount === 'endless') {
          setTimeout(() => {
            setCaretSpacing({
              top: node.offsetTop,
              left:
                node.offsetLeft + (displayExtraChar ? node.offsetWidth + 2 : 0),
            });
          }, 40);
        }
        node.scrollIntoView({ block: 'center' });
      }
    },
    [setCaretSpacing, displayExtraChar, wordCount]
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
