import {
  useEffect,
  useContext,
  useLayoutEffect,
  FC,
  KeyboardEvent,
  useMemo,
  useCallback,
} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Replay from '@mui/icons-material/Replay';
import {
  ThemeContext,
  WordListContext,
  WordContext,
  TimeContext,
  IndexContext,
} from 'providers';
import { useReset } from 'hooks';
import {
  CircularProgress,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { TReactSetState } from 'providers/general/types';
import Word from './Word';
import { keyframes } from '@emotion/react';
import randomizeWords from 'words';
import { ICharList, TWordChar } from 'providers/WordListProvider';

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

const animation = keyframes`
  50% {
    opacity: 0.25
  }
`;

const WordBox: FC<IProps> = ({ setShowTip }) => {
  const {
    wordList,
    wordCount,
    loading,
    author,
    charList,
    setCharList,
    charListNumber,
    setCharListNumber,
  } = useContext(WordListContext);

  const {
    wordBoxConfig,
    setWordBoxConfig,
    wpm,
    setWpm,
    wpmData,
    setWpmData,
    userInput,
    setUserInput,
    inputHistory,
    setInputHistory,
    wordRef,
    textFieldRef,
    focused,
    setFocused,
    settings,
  } = useContext(WordContext);

  const {
    currentCharIndex,
    setCurrentCharIndex,
    currentWordIndex,
    setCurrentWordIndex,
    caretSpacing,
  } = useContext(IndexContext);

  const muiTheme = useTheme();

  const { theme } = useContext(ThemeContext);

  const { timer, setTimer } = useContext(TimeContext);

  const { charCount, incorrectChars, uncorrectedErrors } = wordBoxConfig;

  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      setFocused(true);
    }
  };

  const handleReset = useReset();

  const caretStyling = useMemo(() => {
    const { top, left } = caretSpacing;
    return {
      height: '2rem',
      width: 3,
      top: top - 2,
      left: left - 2,
      position: 'absolute',
      backgroundColor: theme.currentChar,
      animation: `${animation} 1.5s linear infinite`,
      zIndex: 5,
      display:
        top > 0 &&
        left > 0 &&
        Object.keys(wpmData).length !== wordCount &&
        focused
          ? 'initial'
          : 'none',
    } as const;
  }, [theme, caretSpacing, wordCount, wpmData, focused]);

  const generateCharList = useCallback(
    (wordList: string[], startingIndex: number) => {
      const charList: ICharList = {};
      if (wordList.length && !loading) {
        for (let i = 0; i < wordList.length; i++) {
          const word = wordList[i];
          const wordChars: TWordChar[] = [];
          for (const char of word) {
            wordChars.push({ correct: null, char, extra: false });
          }
          charList[i + startingIndex] = {
            skipped: false,
            chars: wordChars,
            length: word.length,
          };
        }
      }
      return charList;
    },
    [loading]
  );

  useEffect(() => {
    if (
      settings.endless &&
      currentWordIndex > 0 &&
      currentWordIndex % 40 === 0
    ) {
      const newWords = randomizeWords(settings);
      const newCharList = generateCharList(newWords, 50 * charListNumber);
      setCharList((prev) => ({ ...prev, ...newCharList }));
      setCharListNumber((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, currentWordIndex]);

  console.log(charListNumber);

  useEffect(() => {
    setCharList(generateCharList(wordList, 0));
  }, [wordList, generateCharList]);

  useEffect(() => {
    setWpm(calculateWpm(charCount, timer.time, uncorrectedErrors));
  }, [timer.time, charCount, setWpm, uncorrectedErrors]);

  // focus on input field whenever charList changes
  useLayoutEffect(() => {
    if (wordList.length > 0) {
      textFieldRef.current!.focus();
    }
  }, [wordList, textFieldRef]);

  useEffect(() => {
    if (wordRef.current)
      wordRef.current.children[currentWordIndex]?.scrollIntoView({
        block: 'center',
      });
  }, [wordRef, currentWordIndex]);

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
        const extraChars = Math.max(
          e.target.value.length - 1 - charList[currentWordIndex].length,
          0
        );

        const missingChars = Math.max(
          charList[currentWordIndex].length - currentCharIndex,
          0
        );

        const totalWordErrors = missingChars + incorrectChars;

        // set wpm data timestep
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
          // add +1 for space
          charCount: prev.charCount + 1,
          incorrectChars: 0,
          uncorrectedErrors: prev.uncorrectedErrors + missingChars,
        }));
        setCurrentCharIndex(0);
        setCurrentWordIndex((prev) => prev + 1);
        setUserInput('');
        setInputHistory((prev) => [...prev, e.target.value]);
      } else {
        // move to next or previous character
        setWordBoxConfig((prev) => ({
          ...prev,
          charCount: prev.charCount + 1,
        }));
        setCurrentCharIndex(e.target.value.length);

        // userInput is > target value only when deleting since userInput is one state behind
        if (userInput.length > e.target.value.length) return;

        if (e.target.value.length <= charList[currentWordIndex].length) {
          const correct =
            e.target.value.length <= charList[currentWordIndex].length &&
            lastUserChar ===
              charList[currentWordIndex].chars[e.target.value.length - 1].char;

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
        else if (e.target.value.length > charList[currentWordIndex].length) {
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

  const handleBackspace = () => {
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
        uncorrectedErrors:
          prev.uncorrectedErrors -
          // subtract 1 to account for the space
          (charList[currentWordIndex - 1].chars.length -
            (previousWord.length - 1)),
        incorrectChars: wpmData[currentWordIndex - 1].incorrectChars,
      }));

      setCurrentWordIndex((prev) => prev - 1);

      setUserInput(inputHistory[currentWordIndex - 1]);

      charList[currentWordIndex - 1].skipped = false;

      setInputHistory((prev) => prev.slice(0, prev.length - 1));
    } else if (currentCharIndex > charList[currentWordIndex].length) {
      charList[currentWordIndex].chars = charList[currentWordIndex].chars.slice(
        0,
        charList[currentWordIndex].chars.length - 1
      );

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
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!timer.id && userInput.length > 0) {
      const intervalTimer = setInterval(
        () => setTimer((prev) => ({ ...prev, time: prev.time + 1 })),
        1000
      );
      setTimer((prev) => ({ ...prev, id: intervalTimer }));
    } else if (
      wordCount !== null &&
      currentWordIndex === wordCount - 1 &&
      e.key === wordList[wordCount - 1][wordList[wordCount - 1].length - 1] &&
      timer.id
    ) {
      clearInterval(timer.id);
    }

    if (e.key === 'Backspace') {
      handleBackspace();
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
        <Box sx={{ color: theme.words }}>{`${currentWordIndex}${
          wordCount !== null ? `/ ${wordCount}` : ''
        }`}</Box>

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
              <Word
                key={wordIdx}
                wordIdx={wordIdx}
                word={word}
                charList={charList}
              />
            ))}
            <Box sx={caretStyling}></Box>
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
                  height: '100%',
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
          padding: '.3em 0',
        }}
      >
        <TextField
          sx={{ width: 0, opacity: 0, boxSizing: 'border-box' }}
          value={userInput}
          onChange={handleUserInput}
          autoFocus
          inputRef={textFieldRef}
          inputProps={{ autoCapitalize: 'none', onKeyDown: handleKeyDown }}
        />
        <Button
          sx={{ color: theme.currentWord, height: '100%', width: '20%' }}
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
