import {
  FC,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useStyles from './styles';
import randomizeWords from '../../words';
import { WordContext } from '../../WordContext';

const WordBox = () => {
  const values = useContext(WordContext);

  const { wordList, setWordList, wordCount, setWpm, timerId, setTimerId } =
    values;

  const classes = useStyles();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const wordRef = useRef<HTMLDivElement>(null);
  const textFieldRef = useRef<HTMLDivElement>(null);

  const charList = useMemo(() => {
    const charList = [];
    if (wordList) {
      for (const word of wordList) {
        charList.push([...word]);
      }
    }
    return charList;
  }, [wordList]);

  const handleReset = useCallback(() => {
    if (wordRef.current && textFieldRef.current && timerId) {
      if (!userInput && !currentWordIndex && !currentCharIndex) {
        setWordList(randomizeWords(wordCount));
      } else {
        const words = wordRef.current.children;
        for (const word of words) {
          for (const char of word.children) {
            char.classList.remove(classes.correct);
            char.classList.remove(classes.incorrect);
            char.classList.remove(classes.currentChar);
          }
          word.classList.remove(classes.currentWord);
        }
        setUserInput('');
        setCurrentCharIndex(0);
        setCurrentWordIndex(0);
      }
      clearInterval(timerId);
      setTimerId(null);
      setTimer(0);
    }
    document.getElementsByTagName('input')[0].focus();
  }, [
    wordRef,
    textFieldRef,
    setWordList,
    userInput,
    currentWordIndex,
    currentCharIndex,
    classes,
    wordCount,
  ]);

  // Timer for WPM
  useEffect(() => {
    let intervalTimer: undefined | NodeJS.Timeout;
    if (userInput.length > 0 && !timerId) {
      intervalTimer = setInterval(() => setTimer((prev) => prev + 1), 1000);
      setTimerId(intervalTimer);
    }
    if (currentWordIndex === charList.length - 1 && intervalTimer) {
      clearInterval(intervalTimer);
    }
  }, [userInput, timerId]);

  console.log(timer);

  // handle pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        document.getElementsByTagName('button')[0].click();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // focus on input field whenever charList changes
  useEffect(() => {
    if (charList.length > 0) {
      document.getElementsByTagName('input')[0].focus();
    }
  }, [charList]);

  // input field logic
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (wordRef.current && currentWordIndex < charList.length) {
      setUserInput(e.target.value);
      const currentWord = wordRef.current.children[currentWordIndex];

      const lastUserChar = e.target.value[e.target.value.length - 1];

      // handle space
      if (lastUserChar === ' ') {
        // if user presses space with no input, do nothing
        if (currentCharIndex === 0) {
          setUserInput('');
          return;
        }
        // if user presses space before reaching the end of the word, make entire word incorrect and remove other styling
        if (currentCharIndex - 1 !== charList[currentWordIndex].length - 1) {
          let i = currentCharIndex;
          if (e.target.value.length > charList[currentWordIndex].length) i = 0;
          for (i; i < currentWord.children.length; i++) {
            const child = currentWord.children[i];
            child.classList.remove(classes.currentChar);
            child.classList.add(classes.incorrect);
          }
        }
        // else move to next word
        setCurrentCharIndex(0);
        setCurrentWordIndex((prev) => prev + 1);
        setUserInput('');
      } else {
        // if the user completely clears input box, remove all classes
        if (e.target.value.length === 0) {
          for (let i = 0; i < currentWord.children.length; i++) {
            const child = currentWord.children[i];
            child.classList.remove(classes.correct);
            child.classList.remove(classes.incorrect);
            child.classList.remove(classes.currentChar);
            currentWord.children[0].classList.add(classes.currentChar);
          }
          // if user deletes character from input, remove that character's styling
        } else if (
          e.target.value.length < currentCharIndex &&
          e.target.value.length <= charList[currentWordIndex].length
        ) {
          currentWord.children[currentCharIndex - 1].classList.remove(
            classes.incorrect
          );
          currentWord.children[currentCharIndex - 1].classList.remove(
            classes.correct
          );
          if (currentCharIndex < charList[currentWordIndex].length)
            currentWord.children[currentCharIndex].classList.remove(
              classes.currentChar
            );
        }
        // move to next character
        setCurrentCharIndex(e.target.value.length);
      }
    }
  };

  // Verifying words logic
  useEffect(() => {
    if (
      wordRef.current &&
      userInput.length > 0 &&
      currentWordIndex < charList.length
    ) {
      // if user types more chars than the current word's length, do nothing
      if (userInput.length > charList[currentWordIndex].length) return;

      const correct =
        userInput[userInput.length - 1] ===
        charList[currentWordIndex][currentCharIndex - 1];

      const currentWord = wordRef.current.children[currentWordIndex];

      if (currentCharIndex < charList[currentWordIndex].length) {
        currentWord.children[currentCharIndex].classList.add(
          classes.currentChar
        );
      }

      if (correct) {
        currentWord.children[currentCharIndex - 1].classList.add(
          classes.correct
        );
        currentWord.children[currentCharIndex - 1].classList.remove(
          classes.currentChar
        );
      } else if (!correct) {
        currentWord.children[currentCharIndex - 1].classList.add(
          classes.incorrect
        );
        currentWord.children[currentCharIndex - 1].classList.remove(
          classes.currentChar
        );
      }
    }
  }, [currentCharIndex, userInput, currentWordIndex, wordRef]); // eslint-disable-line

  // Current word logic
  useEffect(() => {
    if (
      wordRef.current &&
      wordList.length > 0 &&
      currentWordIndex < charList.length
    ) {
      wordRef.current.children[currentWordIndex].classList.add(
        classes.currentWord
      );
      if (currentCharIndex < charList[currentWordIndex].length) {
        wordRef.current.children[currentWordIndex].children[
          currentCharIndex
        ].classList.add(classes.currentChar);
      }
    }
  }, [currentWordIndex, wordRef, wordList, currentCharIndex]); //eslint-disable-line

  return (
    <Container
      sx={{
        border: '1px solid black',
        padding: '2em',
        borderRadius: 5,
      }}
    >
      <Box
        sx={{ display: 'flex', flexWrap: 'wrap', marginBottom: '2em' }}
        ref={wordRef}
      >
        {charList.map((word, idx) => (
          <Box key={idx} sx={{ display: 'flex', margin: '0.25em' }}>
            {word.map((char, idx) => (
              <Box key={char + idx}>{char}</Box>
            ))}
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          sx={{ width: '80%', boxSizing: 'border-box' }}
          variant="outlined"
          value={userInput}
          onChange={handleUserInput}
          autoFocus={true}
          ref={textFieldRef}
        />
        <Button
          sx={{ height: '95%', width: '20%' }}
          variant="outlined"
          onClick={handleReset}
        >
          Redo
        </Button>
      </Box>
    </Container>
  );
};

export default WordBox;
