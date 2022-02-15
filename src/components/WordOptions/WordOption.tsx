import React, { FC, useContext, useMemo } from 'react';
import { IProps, IOptions } from './types';
import { Box } from '@mui/system';
import { ThemeContext, WordContext } from 'providers';
import { wordOptions } from 'providers/WordProvider';

interface IWordProps extends IProps {
  optionKey: keyof IOptions;
  children: React.ReactNode;
  secondaryOptions?: React.ReactNode;
}

function WordOption<T>({
  showOptions,
  setShowOptions,
  optionKey,
  children,
  secondaryOptions,
}: IWordProps) {
  const { settings } = useContext(WordContext);
  const { theme, textColor } = useContext(ThemeContext);

  const optionContainerStyle = {
    display: 'flex',
    opacity: settings.type === 'words' ? 1 : 0,
    visibility: settings.type === 'words' ? 'visible' : 'hidden',
    transition: 'opacity 150ms linear, visibility 0s',
  } as const;

  const optionStyle = (condition: boolean) => ({
    padding: '0em .5em',
    cursor: 'pointer',
    color: condition ? theme.currentWord : textColor,
    opacity: condition ? 1 : 0.6,
    transition: 'opacity 200ms ease-in-out',
    '&:hover': {
      opacity: 1,
    },
  });

  return (
    <Box
      onMouseLeave={() =>
        setShowOptions((prev) => ({ ...prev, [optionKey]: false }))
      }
      onMouseEnter={() =>
        setShowOptions((prev) => ({ ...prev, [optionKey]: true }))
      }
      sx={{
        visibility: showOptions[optionKey] ? 'visible' : 'hidden',
        opacity: showOptions[optionKey] ? 1 : 0,
        transition: 'opacity 300ms ease-in-out',
      }}
    >
      {secondaryOptions && (
        <div style={{ display: 'flex' }}>{secondaryOptions}</div>
      )}
      <div style={{ display: 'flex' }}>{children}</div>
    </Box>
  );
}

export default WordOption;
