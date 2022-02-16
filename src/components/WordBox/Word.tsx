import React, { FC, useContext, useEffect, useRef, useState } from 'react';
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
  const { currentWordRef, settings } = useContext(WordContext);
  const { wordList, wordCount } = useContext(WordListContext);
  const [showWord, setShowWord] = useState(true);

  const wordRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (wordCount !== 'endless' && settings.type !== 'timed') return;

    const wordBox = document.getElementById('wordBox');

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        // hide words that the user has already typed
        if (!entry.isIntersecting && wordIdx < userWordIndex) {
          setShowWord(false);
          if (wordRef.current) obs.unobserve(wordRef.current);
        }
      },
      { root: wordBox, rootMargin: '25px' }
    );

    if (wordRef.current) observer.observe(wordRef.current);

    return () => observer.disconnect();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userWordIndex]);

  // useEffect to reset showWord state when resetting
  useEffect(() => {
    setShowWord(true);
  }, [wordList]);

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
