import React, { FC, useContext } from 'react';
import { Container, Box } from '@mui/material';
import { ThemeContext } from 'providers';
import CustomTooltip from 'components/CustomTooltip';

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
      <Box
        sx={{ textAlign: 'center', fontSize: 'clamp(1.5em, 3vw + .5em, 2em)' }}
      >
        {data}
        {unit || ''}
      </Box>
    );
    if (tooltip) {
      return <CustomTooltip Title={tooltip}>{children}</CustomTooltip>;
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
        padding: '0 !important',
        width: 'max-content',
      }}
    >
      <Box
        sx={{
          lineHeight: 'clamp(1em, 3vw + .5em, 1.5em)',
          fontSize: 'clamp(1em, 3vw + .5em, 1.5em)',
        }}
      >
        {title}
      </Box>
      {renderContent()}
    </Container>
  );
};

export default DataDisplay;
