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
import classNames from 'classnames';

const calculateWpm = (charCount: number, timer: number, errors: number) => {
  const timeToMins = timer / 60;
  const raw = Math.floor(charCount / 5 / timeToMins);
  const uncorrectedErrors = Math.floor(errors / timeToMins);
  const net = Math.max(raw - uncorrectedErrors, 0);

  return {
    raw,
    net,
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
    wpmData,
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
    uncorrectedErrors,
  } = wordBoxConfig;

  const { theme, classes } = useContext(ThemeContext);
  const muiTheme = useTheme();

  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const charList = useMemo(() => {
    const charList = [];
    if (wordList) {
      for (const word of wordList) {
        const wordChars: {
          [key: string]: any;
          correct: null | boolean;
          extra: boolean;
        }[] = [];
        for (const char of word) {
          wordChars.push({ correct: null, char, extra: false });
        }
        charList.push(wordChars);
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
    if (
      currentWordIndex === wordCount - 1 &&
      userInput === wordList[wordCount - 1] &&
      timer.id
    ) {
      clearInterval(timer.id);
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

    if (wordRef.current && currentWordIndex < charList.length) {
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
          for (
            let i = currentCharIndex;
            i < charList[currentWordIndex].length;
            i++
          ) {
            charList[currentWordIndex][i].correct = false;
          }
        }

        // set wpm data timestep
        const extraChars = Math.max(
          e.target.value.length - 1 - charList[currentWordIndex].length,
          0
        );

        const missingChars =
          charList[currentWordIndex].length - currentCharIndex;

        const totalWordErrors = extraChars + missingChars + incorrectChars;

        setWpmData((prev) => ({
          ...prev,
          [currentWordIndex]: {
            word: wordList[currentWordIndex],
            wordNum: currentWordIndex + 1,
            errors: totalWordErrors,
            wpm,
            missingChars,
            extraChars,
            incorrectChars,
          },
        }));

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
        // move to next or previous character
        setWordBoxConfig((prev) => ({
          ...prev,
          currentCharIndex: e.target.value.length,
          charCount:
            e.target.value.length > userInput.length
              ? prev.charCount + 1
              : prev.charCount - 1,
        }));

        if (
          e.target.value.length <= wordList[currentWordIndex].length &&
          e.target.value.length > 0
        ) {
          const correct =
            e.target.value.length - 1 <= wordList[currentWordIndex].length &&
            lastUserChar ===
              wordList[currentWordIndex][e.target.value.length - 1];

          charList[currentWordIndex][e.target.value.length - 1].correct =
            correct;

          setWordBoxConfig((prev) => ({
            ...prev,
            incorrectChars: !correct
              ? prev.incorrectChars + 1
              : prev.incorrectChars,
          }));
        }

        // append extra letters to words if user types more letters
        else if (
          e.target.value.length > wordList[currentWordIndex].length &&
          userInput.length < e.target.value.length
        ) {
          // userInput length is greater than target value length if user deletes a value since the userInput state will always be one state behind the target value
          charList[currentWordIndex].push({
            char: lastUserChar,
            correct: false,
            extra: true,
          });
        }
      }
    }
  };

  console.log(inputHistory);

  useEffect(() => {
    const handleBackspace = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        if (currentCharIndex === 0 && currentWordIndex > 0) {
          setWordBoxConfig((prev) => ({
            ...prev,
            currentWordIndex: prev.currentWordIndex - 1,
            incorrectChars: wpmData[prev.currentWordIndex - 1].incorrectChars,
          }));
          setUserInput(inputHistory[currentWordIndex - 1]);
          setInputHistory((prev) => {
            prev.pop();
            return prev;
          });
        }
        if (currentCharIndex > wordList[currentWordIndex].length) {
          charList[currentWordIndex] = charList[currentWordIndex].slice(
            0,
            charList[currentWordIndex].length - 1
          );
        } else {
          charList[currentWordIndex][
            Math.max(currentCharIndex - 1, 0)
          ].correct = null;
        }
      }
    };
    document.addEventListener('keydown', handleBackspace);
    return () => document.removeEventListener('keydown', handleBackspace);
    // eslint-disable-next-line
  }, [inputHistory, wordBoxConfig, wpmData, textFieldRef, currentCharIndex]);

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
                {word.map((char, charIdx) => {
                  return (
                    <Box
                      className={classNames({
                        [`${classes.animation} ${classes.currentChar}`]:
                          wordIdx === currentWordIndex &&
                          charIdx === currentCharIndex &&
                          charIdx < wordList[currentWordIndex].length,
                        [classes.correct]: char.correct,
                        [classes.incorrect]:
                          char.correct !== null &&
                          !char.correct &&
                          charIdx < wordList[currentWordIndex].length,
                        [classes.extra]: char.extra,
                      })}
                      key={char.char + charIdx}
                    >
                      {char.char}
                    </Box>
                  );
                })}
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
