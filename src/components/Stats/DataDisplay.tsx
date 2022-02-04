import React, { FC, useContext } from 'react';
import { Container, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { ThemeContext } from 'providers';

interface IProps {
  title: string;
  data: number | string;
  unit?: string;
  tooltip?: string;
}

const DataDisplay: FC<IProps> = ({ title, data, unit, tooltip }) => {
  const { theme } = useContext(ThemeContext);
  const renderContent = () => {
    const children = (
      <>
        <Box fontSize="1.1em">{title}</Box>
        <Box fontSize="1.5em">
          {data}
          {unit || ''}
        </Box>
      </>
    );
    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          {children}
        </Tooltip>
      );
    } else {
      return children;
    }
  };

  return (
    <Container
      sx={{
        color: theme.headings,
        marginBottom: '1em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {renderContent()}
    </Container>
  );
};

export default DataDisplay;
