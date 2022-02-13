import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  const { userWordIndex } = useContext(IndexContext);
  const { currentWordRef } = useContext(WordContext);
  const { charList } = useContext(WordListContext);
  const [showWord, setShowWord] = useState(true);

  const wordObserver = useRef<IntersectionObserver>();
  const wordRef = useCallback((node: HTMLDivElement) => {
    const wordBox = document.getElementById('wordBox');
    if (wordObserver.current) wordObserver.current.disconnect();

    wordObserver.current = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowWord(false);
        }
      },
      { root: wordBox, rootMargin: '-10px' }
    );
    if (node) wordObserver.current.observe(node);
  }, []);

  useEffect(() => {
    setShowWord(true);
  }, [charList]);

  if (!showWord) return null;

  return (
    <Box
      color={wordIdx === userWordIndex ? theme.currentWord : theme.words}
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
      ref={userWordIndex === wordIdx ? currentWordRef : wordRef}
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
