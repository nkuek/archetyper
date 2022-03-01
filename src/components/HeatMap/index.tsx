import { Box, Container } from '@mui/material';
import CustomTooltip from 'components/CustomTooltip';
import { ThemeContext } from 'providers';
import { useContext } from 'react';
import KeyRow from './KeyRow';
import rows from './rows.json';

const HeatMap = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <Container
      sx={{
        width: { xs: '100%', md: 'auto' },
        margin: '0 auto',
        backgroundColor: theme.wordBoxBackground,
        padding: '2em',
        borderRadius: 3,
        marginTop: '2em',
      }}
    >
      <CustomTooltip Title="all mistakes are shown whether corrected or uncorrected">
        <Box
          sx={{
            textAlign: 'center',
            fontSize: '1.5em',
            marginBottom: '1em',
            color: theme.words,
          }}
        >
          Error Heatmap
        </Box>
      </CustomTooltip>
      {Object.values(rows).map((row, idx) => (
        <KeyRow key={'row' + idx} keys={row} />
      ))}
    </Container>
  );
};

export default HeatMap;
