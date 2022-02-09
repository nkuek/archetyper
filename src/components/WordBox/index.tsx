import {
  useEffect,
  useContext,
  useLayoutEffect,
  FC,
  KeyboardEvent,
  useMemo,
  useRef,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Replay from '@mui/icons-material/Replay';
import { ThemeContext, WordListContext, WordContext } from 'providers';
import { useReset } from 'hooks';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { TReactSetState } from 'providers/general/types';
import { keyframes } from '@emotion/react';

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

type TWordChars = {
  [key: string]: any;
  correct: null | boolean;
  extra: boolean;
}[];

export interface ICharList {
  [key: string | number]: {
    chars: TWordChars;
    skipped: boolean;
  };
}

const animation = keyframes`
  50% {
    opacity: 0.25
  }
`;

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
    uncorrectedErrors,
  } = wordBoxConfig;

  const charRef = useRef<HTMLDivElement>(null);

  const { theme } = useContext(ThemeContext);
  const muiTheme = useTheme();

  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setWordBoxConfig((prev) => ({ ...prev, focused: true }));
    }
  };

  const handleReset = useReset();

  const charList = useMemo(() => {
    const charList: ICharList = {};
    if (wordList.length && !loading) {
      for (let i = 0; i < wordList.length; i++) {
        const word = wordList[i];
        const wordChars: TWordChars = [];
        for (const char of word) {
          wordChars.push({ correct: null, char, extra: false });
        }
        charList[i] = { skipped: false, chars: wordChars };
      }
    }
    return charList;
  }, [wordList, loading]);

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
    setWpm(calculateWpm(charCount, timer.time, uncorrectedErrors));
  }, [timer.time, charCount, setWpm, uncorrectedErrors]);

  // focus on input field whenever charList changes
  useLayoutEffect(() => {
    if (Object.keys(charList).length > 0) {
      textFieldRef.current!.focus();
    }
  }, [charList, textFieldRef]);

  // input field logic
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (wordRef.current && currentWordIndex < Object.keys(charList).length) {
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
          currentCharIndex !== charList[currentWordIndex].chars.length ||
          e.target.value.length - 1 > charList[currentWordIndex].chars.length
        ) {
          charList[currentWordIndex].skipped = true;
        }

        // set wpm data timestep
        const extraChars = Math.max(
          e.target.value.length - 1 - wordList[currentWordIndex].length,
          0
        );

        const missingChars = Math.max(
          wordList[currentWordIndex].length - currentCharIndex,
          0
        );

        const totalWordErrors = missingChars + incorrectChars;

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
          currentCharIndex: 0,
          currentWordIndex: prev.currentWordIndex + 1,
          charCount: prev.charCount + 1,
          incorrectChars: 0,
          uncorrectedErrors: prev.uncorrectedErrors + missingChars,
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
          charCount: prev.charCount + 1,
        }));

        // userInput is > target value only when deleting since userInput is one state behind
        if (userInput.length > e.target.value.length) return;

        if (e.target.value.length <= wordList[currentWordIndex].length) {
          const correct =
            e.target.value.length - 1 <= wordList[currentWordIndex].length &&
            lastUserChar ===
              wordList[currentWordIndex][e.target.value.length - 1];

          charList[currentWordIndex].chars[e.target.value.length - 1].correct =
            correct;

          if (!correct) {
            setWordBoxConfig((prev) => ({
              ...prev,
              incorrectChars: prev.incorrectChars + 1,
              uncorrectedErrors: prev.uncorrectedErrors + 1,
            }));
          }
        }

        // append extra letters to words if user types more letters
        else if (e.target.value.length > wordList[currentWordIndex].length) {
          // userInput length is greater than target value length if user deletes a value since the userInput state will always be one state behind the target value
          charList[currentWordIndex].chars.push({
            char: lastUserChar,
            correct: false,
            extra: true,
          });
          setWordBoxConfig((prev) => ({
            ...prev,
            uncorrectedErrors: prev.uncorrectedErrors + 1,
            incorrectChars: prev.incorrectChars + 1,
          }));
        }
      }
    }
  };

  const handleBackspace = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const decrementErrors = () => {
        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors: prev.uncorrectedErrors - 1,
        }));
      };

      if (currentCharIndex === 0 && currentWordIndex > 0) {
        const previousWord = inputHistory[currentWordIndex - 1];

        setWordBoxConfig((prev) => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex - 1,
          uncorrectedErrors:
            prev.uncorrectedErrors -
            // subtract 1 to account for the space
            (charList[currentWordIndex - 1].chars.length -
              (previousWord.length - 1)),
        }));

        setUserInput(inputHistory[currentWordIndex - 1]);

        charList[currentWordIndex - 1].skipped = false;

        setInputHistory((prev) => prev.slice(0, prev.length - 1));
      } else if (currentCharIndex > wordList[currentWordIndex].length) {
        charList[currentWordIndex].chars = charList[
          currentWordIndex
        ].chars.slice(0, charList[currentWordIndex].chars.length - 1);

        decrementErrors();
      } else if (currentCharIndex > 0) {
        if (!charList[currentWordIndex].chars[currentCharIndex - 1].correct) {
          decrementErrors();
        }

        charList[currentWordIndex].chars[currentCharIndex - 1].correct = null;
      }

      setWordBoxConfig((prev) => ({
        ...prev,
        charCount: Math.max(prev.charCount - 1, 0),
      }));
    }
  };

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
            {Object.values(charList).map((word, wordIdx) => (
              <Box
                color={
                  wordIdx === currentWordIndex ? theme.currentWord : theme.words
                }
                key={wordIdx}
                sx={{
                  display: 'flex',
                  margin: '0.25em',
                  textDecoration: word.skipped
                    ? `underline ${theme.incorrect || 'red'}`
                    : 'none',
                }}
              >
                {word.chars.map((char, charIdx) => {
                  const displayExtraChar =
                    wordIdx === currentWordIndex &&
                    charIdx >= wordList[currentWordIndex].length - 1 &&
                    charIdx === currentCharIndex - 1 &&
                    currentCharIndex >= wordList[currentWordIndex].length - 1;
                  const currentChar =
                    wordIdx === currentWordIndex &&
                    charIdx === currentCharIndex;

                  const caretStyling = (condition: boolean) =>
                    ({
                      height: '1.5em',
                      width: 3,
                      top: -4,
                      position: 'absolute',
                      backgroundColor: theme.currentChar,
                      display: condition ? 'initial' : 'none',
                      visibility: condition ? 'visible' : 'hidden',
                      animation: `${animation} 1.5s linear infinite`,
                    } as const);
                  return (
                    <Box
                      key={char.char + charIdx}
                      sx={{ position: 'relative' }}
                    >
                      <Box
                        sx={{
                          ...caretStyling(currentChar),
                          right: charRef.current?.scrollWidth,
                        }}
                      ></Box>
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
                          ...caretStyling(displayExtraChar),
                          left: charRef.current?.scrollWidth,
                          transformOrigin: 'top right',
                        }}
                      ></Box>
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
          inputProps={{ autoCapitalize: 'none', onKeyDown: handleBackspace }}
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
