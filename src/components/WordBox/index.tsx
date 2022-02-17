import { useEffect, useContext, FC, KeyboardEvent, useMemo } from 'react';
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
import { useFocus, useLocalStorage, useReset } from 'hooks';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { TReactSetState } from 'providers/general/types';
import Word from './Word';
import { animation, slowAnimation } from './styles';
import { TWordChar } from 'providers/WordListProvider';
import randomizeWords from 'words';
import MessageOverlay from './MessageOverlay';
import CustomTooltip from 'components/CustomTooltip';

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
  setShowWarning: TReactSetState<boolean>;
}

const WordBox: FC<IProps> = ({ setShowTip, setShowWarning }) => {
  const {
    wordList,
    wordCount,
    loading,
    author,
    charList,
    setCharList,
    errorMessage,
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
    textFieldRef,
    focused,
    generateCharList,
    settings,
  } = useContext(WordContext);

  const {
    currentCharIndex,
    setCurrentCharIndex,
    currentWordIndex,
    setCurrentWordIndex,
    caretSpacing,
    userWordIndex,
    setUserWordIndex,
  } = useContext(IndexContext);

  const muiTheme = useTheme();
  const { theme } = useContext(ThemeContext);
  const { timer, setTimer } = useContext(TimeContext);
  const { charCount, incorrectChars, uncorrectedErrors } = wordBoxConfig;

  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const focus = useFocus();

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    focus();
  };

  const { value: LSTime } = useLocalStorage('typer-time', 30);

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
      animation: !timer.id
        ? `${animation} 1.1s ease infinite`
        : `${slowAnimation} 1.5s linear infinite`,
      zIndex: 5,
      transition: 'left 75ms ease',
      display:
        top > 0 &&
        left > 0 &&
        Object.keys(wpmData).length !== wordCount &&
        focused
          ? 'initial'
          : 'none',
    } as const;
  }, [theme, caretSpacing, wordCount, wpmData, focused, timer.id]);

  useEffect(() => {
    if (wordList.length) {
      setCharList(generateCharList(wordList));
      focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordList, generateCharList]);

  useEffect(() => {
    if (settings.type === 'quotes') return;
    const newWord = randomizeWords(settings, true);
    const wordChars: TWordChar[] = [];
    for (const char of newWord) {
      wordChars.push({ correct: null, char });
    }
    setCharList((prev) => ({
      ...prev,
      [Object.keys(prev).length]: {
        chars: wordChars,
        length: wordChars.length,
        word: newWord,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWordIndex]);

  useEffect(() => {
    const time = timer.countdown ? LSTime - timer.time + 1 : timer.time;
    setWpm(calculateWpm(charCount, time, uncorrectedErrors));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer.time, charCount, uncorrectedErrors]);

  useEffect(() => {
    if (!timer.id && userInput) {
      const intervalTimer = setInterval(
        () =>
          setTimer((prev) => ({
            ...prev,
            time: prev.time + (timer.countdown ? -1 : 1),
          })),
        1000
      );
      setTimer((prev) => ({ ...prev, id: intervalTimer }));
    } else if (
      timer.id &&
      ((timer.countdown && timer.time === 0) ||
        (settings.type !== 'timed' &&
          wordCount !== 'endless' &&
          currentWordIndex === wordCount - 1 &&
          userInput === charList[wordCount - 1].word))
    ) {
      clearInterval(timer.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, currentWordIndex, timer, charList, wordCount]);

  useEffect(() => {
    if (timer.id) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // input field logic
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    if (currentWordIndex < Object.keys(charList).length) {
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
          currentCharIndex !== charList[userWordIndex].chars.length ||
          e.target.value.length - 1 > charList[userWordIndex].chars.length
        ) {
          charList[userWordIndex].skipped = true;
          // loop over remaining chars and set skipped to true
          for (
            let i = currentCharIndex;
            i < charList[userWordIndex].length;
            i++
          ) {
            charList[userWordIndex].chars[i].skipped = true;
          }
        }

        let missingChars = 0;
        let extraChars = 0;

        charList[userWordIndex].chars.forEach((char) => {
          if (char.skipped) missingChars++;
          else if (char.extra) extraChars++;
        });

        const totalWordErrors = missingChars + incorrectChars;

        // set wpm data timestep
        setWpmData((prev) => ({
          ...prev,
          [userWordIndex]: {
            word: charList[userWordIndex].word,
            wordNum: userWordIndex + 1,
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
        if (userWordIndex === currentWordIndex) {
          setCurrentWordIndex((prev) => prev + 1);
        }
        setUserWordIndex((prev) => prev + 1);
        setUserInput('');
        setInputHistory((prev) => [...prev, e.target.value]);
      } else {
        // move to next or previous character
        setCurrentCharIndex(e.target.value.length);

        // userInput is > target value only when deleting since userInput is one state behind
        if (userInput.length > e.target.value.length) return;

        setWordBoxConfig((prev) => ({
          ...prev,
          charCount: prev.charCount + 1,
        }));

        if (e.target.value.length <= charList[userWordIndex].length) {
          const isCorrect =
            e.target.value.length <= charList[userWordIndex].length &&
            lastUserChar ===
              charList[userWordIndex].chars[e.target.value.length - 1].char;

          charList[userWordIndex].chars[e.target.value.length - 1].correct =
            isCorrect;

          if (!isCorrect) {
            setWordBoxConfig((prev) => ({
              ...prev,
              incorrectChars: prev.incorrectChars + 1,
              uncorrectedErrors: prev.uncorrectedErrors + 1,
            }));
          }
        }

        // append extra letters to words if user types more letters
        else if (e.target.value.length > charList[userWordIndex].length) {
          charList[userWordIndex].chars.push({
            char: lastUserChar,
            correct: false,
            extra: true,
            skipped: false,
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

  useEffect(() => {
    const capsLockListener = (e: globalThis.KeyboardEvent) => {
      setShowWarning(!mobileDevice && e.getModifierState('CapsLock'));
      setShowTip(false);
    };
    window.addEventListener('keydown', capsLockListener);
    window.addEventListener('keyup', capsLockListener);
    return () => {
      window.removeEventListener('keydown', capsLockListener);
      window.removeEventListener('keyup', capsLockListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const decrementErrors = () => {
        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors: prev.uncorrectedErrors - 1,
        }));
      };

      const decrementWord = () => {
        setUserWordIndex((prev) => prev - 1);
        charList[userWordIndex - 1].skipped = false;
        setInputHistory((prev) => prev.slice(0, prev.length - 1));
      };

      const resetWord = (index: number) => {
        let newUncorrectErrors = uncorrectedErrors;
        charList[index].chars.forEach((char) => {
          if ((char.correct !== null && !char.correct) || char.extra) {
            newUncorrectErrors--;
          }
        });
        const baseWord = charList[index].chars.filter((char) => !char.extra);

        const resetWord: TWordChar[] = baseWord.map((char) => ({
          correct: null,
          char: char.char,
          skipped: false,
        }));

        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors: newUncorrectErrors,
          incorrectChars: 0,
        }));

        charList[index].chars = resetWord;
      };

      const previousWord = inputHistory[userWordIndex - 1];

      // deleting entire word
      if (e.getModifierState('Alt') || e.getModifierState('Meta')) {
        // if at the beginning of a word, delete entire previous word
        if (currentCharIndex === 0 && userWordIndex > 0) {
          resetWord(userWordIndex - 1);
          decrementWord();
          // else delete just current word
        } else {
          resetWord(userWordIndex);
        }
        // move back one word if backspacing at the beginning of a word
      } else if (currentCharIndex === 0 && userWordIndex > 0) {
        setWordBoxConfig((prev) => ({
          ...prev,
          uncorrectedErrors:
            prev.uncorrectedErrors -
            // subtract 1 to account for the space
            (charList[userWordIndex - 1].chars.length -
              (previousWord.length - 1)),
          incorrectChars: wpmData[userWordIndex - 1].incorrectChars,
        }));

        decrementWord();

        setUserInput(inputHistory[userWordIndex - 1]);
        // if deleting an extra character, remove it from the charList
      } else {
        if (currentCharIndex > charList[userWordIndex].length) {
          charList[userWordIndex].chars = charList[userWordIndex].chars.slice(
            0,
            charList[userWordIndex].chars.length - 1
          );
          // otherwise just decrement the num errors and update correct state
        } else if (currentCharIndex > 0) {
          charList[userWordIndex].chars[currentCharIndex - 1].correct = null;
          if (
            !charList[userWordIndex].chars[currentCharIndex - 1].correct ||
            charList[userWordIndex].chars[currentCharIndex - 1].extra
          ) {
            decrementErrors();
          }
        }
      }
    }
  };

  return (
    <Container
      sx={{
        borderRadius: 5,
        fontSize: '1.5em',
        backgroundColor: theme.wordBoxBackground,
        border: theme.border,
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
        <Box sx={{ color: theme.words }}>{`${userWordIndex}${
          wordCount !== 'endless' &&
          timer._time !== 'endless' &&
          settings.type !== 'timed'
            ? ` / ${wordCount}`
            : ''
        }`}</Box>

        <Box sx={{ color: theme.words }}>{`${timer.time}s`}</Box>
      </Container>

      <div style={{ position: 'relative', display: 'flex' }}>
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
          id="wordBox"
        >
          {Object.values(charList).map((word, wordIdx) => (
            <Word key={wordIdx} wordIdx={wordIdx} word={word} />
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
        </Box>
        {errorMessage && <MessageOverlay message={errorMessage} />}
        {!focused && <MessageOverlay message="click here to start typing" />}
        {loading && (
          <MessageOverlay
            message={<CircularProgress sx={{ color: theme.headings }} />}
          />
        )}
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '.3em 0',
        }}
      >
        <div style={{ width: 0, opacity: 0, boxSizing: 'border-box' }}>
          <input
            value={userInput}
            onChange={handleUserInput}
            ref={textFieldRef}
            autoFocus
            onKeyDown={handleKeyDown}
            style={{ padding: '1em' }}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>
        <CustomTooltip title="restart test">
          <Button
            sx={{ color: theme.currentWord, height: '100%', width: '20%' }}
            onClick={(e) => {
              handleReset(e);
              if (!mobileDevice) {
                setShowTip(true);
                setShowWarning(false);
              }
            }}
          >
            <Replay />
          </Button>
        </CustomTooltip>
      </Box>
    </Container>
  );
};

export default WordBox;
