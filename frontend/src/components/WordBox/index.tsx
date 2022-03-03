import { useEffect, useContext, FC } from 'react';
import { Box, Container, Button } from '@mui/material';
import Replay from '@mui/icons-material/Replay';
import {
  ThemeContext,
  WordListContext,
  WordContext,
  IndexContext,
  InputContext,
  SettingsContext,
} from 'providers';
import {
  useCapsLockListener,
  useCaretStyling,
  useFocus,
  useInputLogic,
  useKeyDownLogic,
  useReset,
  useTimerLogic,
} from 'hooks';
import { CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { TReactSetState } from 'providers/general/types';
import Word from './Word';
import MessageOverlay from './MessageOverlay';
import CustomTooltip from 'components/CustomTooltip';

export interface IProps {
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

  const { textFieldRef, generateCharList } = useContext(WordContext);

  const { focused, settings } = useContext(SettingsContext);

  const { userInput, timer } = useContext(InputContext);

  const { userWordIndex } = useContext(IndexContext);

  const { theme } = useContext(ThemeContext);

  const muiTheme = useTheme();
  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const focus = useFocus();

  const handleFocus = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    focus();
  };

  const handleReset = useReset();

  // useEffect that increments/decrements timer and set wpm
  useTimerLogic();

  // useEffect event listener to show caps lock warning
  useCapsLockListener({ setShowTip, setShowWarning });

  // input field logic
  const handleUserInput = useInputLogic();
  const handleKeyDown = useKeyDownLogic();
  const caretStyling = useCaretStyling();

  // reset test if changing settings while test in progress
  useEffect(() => {
    if (timer.id) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    if (wordList.length) {
      setCharList(generateCharList(wordList));
      focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordList, generateCharList]);

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
            height: {
              xs: '14.5vh',
              xl: '10vh',
            },
            '@media screen and (max-height: 800px)': {
              height: '22vh',
              lineHeight: '1.75rem',
            },
            '@media screen and (max-height: 1279px)': {
              height: '16vh',
            },
            '@media screen and (min-height: 1280px) and (min-width: 800px)': {
              height: '10vh',
            },
            overflow: 'hidden',
            fontSize: 'clamp(1rem, 5vw + .25rem, 1.5rem)',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            lineHeight: 'clamp(1.5rem, 5vw + .25rem, 2.25rem)',
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
            style={{ fontSize: '1em', width: '1em' }}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
          />
        </div>
        <CustomTooltip Title="restart test">
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
