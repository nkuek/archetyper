import { ThemeContext, WordContext } from 'providers';
import { ISettings } from 'providers/WordProvider';
import { useCallback, useContext, useMemo } from 'react';

const useWordOptionTheme = (type: ISettings['type']) => {
  const { theme, textColor } = useContext(ThemeContext);
  const { settings } = useContext(WordContext);

  const optionContainerStyle = useMemo(
    () =>
      ({
        display: 'flex',
        opacity: settings.type === type ? 1 : 0,
        visibility: settings.type === type ? 'visible' : 'hidden',
        transition: 'opacity 150ms linear, visibility 0s',
      } as const),
    [settings.type]
  );

  const getOptionStyle = useCallback(
    (condition: boolean) =>
      ({
        padding: '0em .5em',
        cursor: 'pointer',
        color: condition ? theme.currentWord : textColor,
        opacity: condition ? 1 : 0.6,
        transition: 'opacity 200ms ease-in-out',
        '&:hover': {
          opacity: 1,
        },
      } as const),
    [theme, textColor]
  );

  return useMemo(
    () => ({
      getOptionStyle,
      optionContainerStyle,
    }),
    [optionContainerStyle, getOptionStyle]
  );
};

export default useWordOptionTheme;
