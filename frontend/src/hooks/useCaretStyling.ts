import { keyframes } from '@emotion/react';
import {
  IndexContext,
  InputContext,
  SettingsContext,
  ThemeContext,
  WordContext,
  WordListContext,
} from 'providers';
import { useContext, useMemo } from 'react';

export const animation = keyframes`
  50% {
    opacity: 0
  }
`;

export const slowAnimation = keyframes`
50% {
  opacity: 0.25
}
`;

export const useCaretStyling = () => {
  const { caretSpacing } = useContext(IndexContext);
  const { theme } = useContext(ThemeContext);
  const { wpmData } = useContext(WordContext);
  const { wordCount } = useContext(WordListContext);
  const { timer } = useContext(InputContext);
  const { focused } = useContext(SettingsContext);

  return useMemo(() => {
    const { top, left } = caretSpacing;
    return {
      height: 'clamp(1.5rem, 5vw + .5rem, 2rem)',
      width: 'clamp(1px, 1vw - 1px, 3px)',
      top: {
        xs: top - 1,
        sm: top + 1,
        md: top + 2.5,
      },
      '@media screen and (max-height: 800px)': {
        top: top - 2,
      },
      left: `clamp(${left - 4}px, 5vw - .25px, ${left - 2}px)`,
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
};
