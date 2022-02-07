import { useMemo, useEffect, useContext, useLayoutEffect, FC } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Replay from '@mui/icons-material/Replay';
import { ThemeContext, WordListContext, WordContext } from 'providers';
import { useReset } from 'hooks';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { TReactSetState } from 'providers/general/types';

const calculateWpm = (charCount: number, timer: number, errors: number) => {
  const timeToMins = timer / 60;
  const raw = Math.floor(charCount / 5 / timeToMins);
  const gross = raw - Math.floor(errors || 0 / timeToMins);

  return {
    raw,
    gross,
  };
};

interface IProps {
  setShowTip: TReactSetState<boolean>;
}

const WordBox: FC<IProps> = ({ setShowTip }) => {
  const { wordList, wordCount, loading, author } = useContext(WordListContext);
  const {
    wordBoxConfig,
    setWordBoxConfig,
    wpm,
    setWpm,
    setWpmData,
    timer,
    setTimer,
    userInput,
    setUserInput,
    inputHistory,
    setInputHistory,
    wordRef,
    textFieldRef,
  } = useContext(WordContext);

  const {
    charCount,
    currentCharIndex,
    currentWordIndex,
    focused,
    incorrectChars,
    totalErrors,
  } = wordBoxConfig;

  const { theme, classes } = useContext(ThemeContext);
  const muiTheme = useTheme();

  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));

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
      setWordBoxConfig((prev) => ({ ...prev, focused: true }));
    }
  };

  const handleReset = useReset();

  // Timer for WPM
  useEffect(() => {
    if (userInput.length > 0 && !timer.id) {
      const intervalTimer = setInterval(
        () => setTimer((prev) => ({ ...prev, time: prev.time + 1 })),
        1000
      );
      setTimer((prev) => ({ ...prev, id: intervalTimer }));
    }
  }, [userInput, timer.id]); // eslint-disable-line

  useEffect(() => {
    setWpm(calculateWpm(charCount, timer.time, totalErrors));
  }, [timer.time, charCount, setWpm, totalErrors]);

  // focus on input field whenever charList changes
  useLayoutEffect(() => {
    if (charList.length > 0) {
      textFieldRef.current!.focus();
    }
  }, [charList, textFieldRef]);

  // input field logic
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    // set char count based on user Input
    // set char index based on user input length

    if (wordRef.current && currentWordIndex < charList.length) {
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
            child.classList.remove(
              ...classes.currentChar.split(' '),
              classes.animation
            );
            child.classList.add(...classes.incorrect.split(' '));
          }
        }

        // set wpm data timestep
        const extraChars =
          e.target.value.length - 1 - charList[currentWordIndex].length > 0
            ? e.target.value.length - 1 - charList[currentWordIndex].length
            : 0;

        const missingChars =
          charList[currentWordIndex].length - currentCharIndex;

        const totalWordErrors = extraChars + missingChars + incorrectChars;

        setWpmData((prev) => [
          ...prev,
          {
            word: wordList[currentWordIndex],
            wordNum: currentWordIndex + 1,
            errors: totalWordErrors,
            wpm,
            missingChars,
            extraChars,
            incorrectChars,
          },
        ]);

        // else move to next word
        setWordBoxConfig((prev) => ({
          ...prev,
          totalErrors: prev.totalErrors + totalWordErrors,
          currentCharIndex: 0,
          currentWordIndex: prev.currentWordIndex + 1,
          charCount: prev.charCount + 1,
          incorrectChars: 0,
        }));
        setUserInput('');
        setInputHistory((prev) => [...prev, e.target.value]);
        wordRef.current.children[currentWordIndex + 1]?.scrollIntoView({
          block: 'center',
        });
      } else {
        // if the user completely clears input box, remove all classes
        if (e.target.value.length === 0) {
          for (let i = 0; i < currentWord.children.length; i++) {
            const child = currentWord.children[i];
            child.classList.remove(...classes.correct.split(' '));
            child.classList.remove(...classes.incorrect.split(' '));
            child.classList.remove(
              ...classes.currentChar.split(' '),
              classes.animation
            );
            currentWord.children[0].classList.add(
              ...classes.currentChar.split(' ')
            );
          }
          // if user deletes character from input, remove that character's styling
        }
        // move to next character
        if (currentCharIndex < charList[currentWordIndex].length) {
          const currentChar = currentWord.children[currentCharIndex];
          currentChar.classList.remove(
            ...classes.currentChar.split(' '),
            classes.animation
          );
          currentChar.classList.remove(...classes.correct.split(' '));
          currentChar.classList.remove(...classes.incorrect.split(' '));
        }
        if (e.target.value.length <= charList[currentWordIndex].length) {
          setWordBoxConfig((prev) => ({
            ...prev,
            currentCharIndex: e.target.value.length,
            charCount: prev.charCount + 1,
          }));
        }

        const extraChars = Array.from(currentWord.children).filter((child) =>
          child.classList.contains(classes.extra)
        );

        // append extra letters to words if user types more letters
        if (e.target.value.length > wordList[currentWordIndex].length) {
          // userInput length is greater than target value length if user deletes a value since the userInput state will always be one state behind the target value
          if (userInput.length > e.target.value.length) {
            currentWord.removeChild(
              currentWord.children[currentWord.children.length - 1]
            );
          } else {
            const extraChar = e.target.value[e.target.value.length - 1];
            const extraLetterEl = document.createElement('div');
            extraLetterEl.innerHTML = extraChar;
            extraLetterEl.classList.add(classes.extra);
            currentWord.appendChild(extraLetterEl);
          }
          // remove extra char if user deletes
        } else {
          extraChars.forEach((char) => currentWord.removeChild(char));
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
          ...classes.currentChar.split(' '),
          classes.animation
        );
      }

      if (correct) {
        currentWord.children[currentCharIndex - 1].classList.add(
          ...classes.correct.split(' ')
        );
        currentWord.children[currentCharIndex - 1].classList.remove(
          ...classes.currentChar.split(' '),
          classes.animation
        );
      } else if (!correct) {
        currentWord.children[currentCharIndex - 1].classList.add(
          ...classes.incorrect.split(' ')
        );
        currentWord.children[currentCharIndex - 1].classList.remove(
          ...classes.currentChar.split(' '),
          classes.animation
        );
        setWordBoxConfig((prev) => ({
          ...prev,
          incorrectChars: prev.incorrectChars + 1,
        }));
      }
    }
  }, [currentCharIndex, userInput, currentWordIndex, wordRef]); // eslint-disable-line

  // Current word logic
  useEffect(() => {
    if (
      wordRef.current &&
      wordList.length > 0 &&
      currentWordIndex < charList.length &&
      !loading
    ) {
      if (currentCharIndex < charList[currentWordIndex].length) {
        wordRef.current.children[currentWordIndex].children[
          currentCharIndex
        ].classList.add(...classes.currentChar.split(' '), classes.animation);
      }
    }
    if (
      currentWordIndex === charList.length - 1 &&
      userInput === wordList[wordList.length - 1] &&
      timer.id
    ) {
      clearInterval(timer.id);
    }
    //eslint-disable-next-line
  }, [currentWordIndex, wordList, currentCharIndex, loading, timer.id]);

  return (
    <Container
      sx={{
        borderRadius: 5,
        fontSize: '1.5em',
        backgroundColor: theme.wordBoxBackground,
      }}
      onClick={handleFocus}
    >
      <Container
        sx={{
          visibility: timer.id ? 'visible' : 'hidden',
          height: '2em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          fontSize: 'clamp(1rem, 5vw + .25rem, 1.5rem)',
        }}
        disableGutters
      >
        <Box
          sx={{ color: theme.words }}
        >{`${currentWordIndex} / ${wordCount}`}</Box>
        <Box sx={{ color: theme.words }}>{`${timer.time}s`}</Box>
      </Container>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 100,
          }}
        >
          <CircularProgress sx={{ color: theme.headings }} />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              height: 100,
              overflow: 'hidden',
              fontSize: 'clamp(1rem, 5vw + .25rem, 1.5rem)',
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
            }}
            ref={wordRef}
          >
            {charList.map((word, wordIdx) => (
              <Box
                color={
                  wordIdx === currentWordIndex ? theme.currentWord : theme.words
                }
                key={wordIdx}
                sx={{ display: 'flex', margin: '0.25em' }}
              >
                {word.map((char, charIdx) => (
                  <Box key={char + charIdx}>{char}</Box>
                ))}
              </Box>
            ))}
            {author && (
              <Box
                sx={{
                  color: theme.words,
                  filter: 'brightness(70%)',
                  margin: '0.25em',
                  fontStyle: 'italic',
                }}
              >
                &#8212;{author}
              </Box>
            )}
            {!focused && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  height: 110,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  background: 'white',
                  cursor: 'pointer',
                  color: theme.words,
                  backgroundColor: theme.wordBoxBackground,
                }}
              >
                click here to start typing
              </Box>
            )}
          </Box>
        </>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextField
          sx={{ width: 0, opacity: 0, boxSizing: 'border-box' }}
          value={userInput}
          onChange={handleUserInput}
          autoFocus
          inputRef={textFieldRef}
          inputProps={{ autoCapitalize: 'none' }}
        />
        <Button
          sx={{ color: theme.currentWord, height: '95%', width: '20%' }}
          onClick={(e) => {
            handleReset(e);
            if (!mobileDevice) setShowTip(true);
          }}
        >
          <Replay />
        </Button>
      </Box>
    </Container>
  );
};

export default WordBox;
