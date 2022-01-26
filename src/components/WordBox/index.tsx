import {
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
import randomizeWords from 'words';
import { WordContext } from 'WordContext';
import Replay from '@mui/icons-material/Replay';

const calculateWpm = (charCount: number, timer: number) =>
  Math.floor(charCount / 5 / (timer / 60));

const WordBox = () => {
  const {
    wordList,
    setWordList,
    wordCount,
    setWpm,
    timerId,
    setTimerId,
    wpm,
    setWpmData,
    timer,
    setTimer,
    focused,
    setFocused,
  } = useContext(WordContext);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const classes = useStyles();

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

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setFocused(true);
    }
  };

  const handleReset = useCallback(() => {
    if (wordRef.current && textFieldRef.current) {
      if (!userInput && !currentWordIndex && !currentCharIndex) {
        setWordList(randomizeWords());
      } else {
        const words = wordRef.current.children;
        const extraWords = document.querySelectorAll(`.${classes.extra}`);
        extraWords.forEach((word) => word.remove());
        for (const word of words) {
          for (const char of word.children) {
            char.classList.remove(classes.correct);
            char.classList.remove(classes.incorrect);
            char.classList.remove(classes.currentChar);
          }
        }
      }
      setUserInput('');
      setCurrentCharIndex(0);
      setCurrentWordIndex(0);
      setIncorrectChars(0);
      setWpm(0);
      setWpmData([]);
      if (timerId) {
        clearInterval(timerId);
        setTimerId(null);
        setTimer(1);
        setCharCount(0);
      }
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
    setTimerId,
    timerId,
    setTimer,
    setWpm,
    setWpmData,
  ]);

  // Timer for WPM
  useEffect(() => {
    if (userInput.length > 0 && !timerId) {
      const intervalTimer = setInterval(
        () => setTimer((prev) => prev + 1),
        1000
      );
      setTimerId(intervalTimer);
    }
  }, [userInput, timerId]); // eslint-disable-line

  useEffect(() => {
    setWpm(calculateWpm(charCount, timer));
  }, [timer, charCount, setWpm]);

  const handleDelete = useCallback(
    (e: KeyboardEvent) => {
      console.log(wordRef.current?.children[currentWordIndex].children.length);
      if (e.key === 'Backspace' && userInput && wordRef.current) {
        setCharCount((prev) => prev - 2);
        setUserInput((prev) => prev.slice(0, userInput.length));
        const currentWord = wordRef.current.children[currentWordIndex];
        if (currentWord.children.length > charList[currentWordIndex].length) {
          const lastChild =
            currentWord.children[currentWord.children.length - 1];
          currentWord.removeChild(lastChild);
        }
      }
    },
    [userInput, charList, currentWordIndex, wordRef]
  );

  // handle character count when user presses delete
  useEffect(() => {
    document.addEventListener('keydown', handleDelete);
    return () => document.removeEventListener('keydown', handleDelete);
  }, [timerId, handleDelete]);

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
        if (
          currentCharIndex !== charList[currentWordIndex].length ||
          e.target.value.length - 1 > charList[currentWordIndex].length
        ) {
          for (let i = currentCharIndex; i < currentWord.children.length; i++) {
            const child = currentWord.children[i];
            child.classList.remove(classes.currentChar);
            child.classList.add(classes.incorrect);
          }
        }

        // set wpm data timestep
        const extraChars =
          e.target.value.length - 1 - charList[currentWordIndex].length > 0
            ? e.target.value.length - 1 - charList[currentWordIndex].length
            : 0;
        const missingChars =
          charList[currentWordIndex].length - currentCharIndex;
        setWpmData((prev) => [
          ...prev,
          {
            word: wordList[currentWordIndex],
            wordNum: currentWordIndex + 1,
            errors: missingChars + extraChars + incorrectChars,
            wpm,
            missingChars,
            extraChars,
            incorrectChars,
          },
        ]);

        // else move to next word
        setCurrentCharIndex(0);
        setCurrentWordIndex((prev) => prev + 1);
        setCharCount((prev) => prev + 1);
        setIncorrectChars(0);
        setUserInput('');
        wordRef.current.children[currentWordIndex + 1].scrollIntoView({
          block: 'center',
        });
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
        }
        // move to next character
        if (currentCharIndex < charList[currentWordIndex].length) {
          const currentChar = currentWord.children[currentCharIndex];
          currentChar.classList.remove(classes.currentChar);
          currentChar.classList.remove(classes.correct);
          currentChar.classList.remove(classes.incorrect);
        }
        if (e.target.value.length <= charList[currentWordIndex].length) {
          setCurrentCharIndex(e.target.value.length);
          setCharCount((prev) => prev + 1);
        }

        // append extra letters to words if user types more letters
        if (e.target.value.length > charList[currentWordIndex].length) {
          const extraLetter = e.target.value[e.target.value.length - 1];
          const extraLetterEl = document.createElement('div');
          extraLetterEl.innerHTML = extraLetter;
          extraLetterEl.classList.add(classes.extra);
          currentWord.appendChild(extraLetterEl);
        }
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
        setIncorrectChars((prev) => prev + 1);
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
      if (currentCharIndex < charList[currentWordIndex].length) {
        wordRef.current.children[currentWordIndex].children[
          currentCharIndex
        ].classList.add(classes.currentChar);
      }
    }
    if (
      currentWordIndex === charList.length - 1 &&
      userInput === wordList[wordList.length - 1] &&
      timerId
    ) {
      clearInterval(timerId);
    }
  }, [currentWordIndex, wordRef, wordList, currentCharIndex]); //eslint-disable-line

  // useEffect(() => {
  //   const blurWindow = () => setFocused(false);
  //   const focusWindow = () => setFocused(true);
  //   window.addEventListener('blur', blurWindow);
  //   window.addEventListener('focus', focusWindow);
  //   return () => {
  //     window.removeEventListener('blur', blurWindow);
  //     window.removeEventListener('focus', blurWindow);
  //   };
  // });

  return (
    <Container
      sx={{
        borderRadius: 5,
        fontSize: '1.5em',
      }}
      onClick={handleFocus}
    >
      <Container
        sx={{
          visibility: timerId ? 'visible' : 'hidden',
          height: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
        }}
        disableGutters
      >
        <Box>{`${currentWordIndex} / ${wordCount}`}</Box>
        <Box>{`${timer}s`}</Box>
      </Container>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
          height: 100,
          overflow: 'hidden',
        }}
        ref={wordRef}
      >
        {charList.map((word, wordIdx) => (
          <Box
            color={wordIdx === currentWordIndex ? 'plum' : 'black'}
            key={wordIdx}
            sx={{ display: 'flex', margin: '0.25em' }}
          >
            {word.map((char, charIdx) => (
              <Box key={char + charIdx}>{char}</Box>
            ))}
          </Box>
        ))}
        {!focused && (
          <Box
            sx={{
              position: 'absolute',
              zIndex: 2,
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              background: 'white',
            }}
          >
            Click here to start typing
          </Box>
        )}
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
          sx={{ width: 0, opacity: 0, boxSizing: 'border-box' }}
          variant="outlined"
          value={userInput}
          onChange={handleUserInput}
          autoFocus
          inputRef={textFieldRef}
        />
        <Button
          sx={{ color: 'gray', height: '95%', width: '20%' }}
          onClick={handleReset}
        >
          <Replay />
        </Button>
      </Box>
    </Container>
  );
};

export default WordBox;
