import { useMemo, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { WordContext } from '../../WordContext';

const WordOptions = () => {
  const values = useContext(WordContext);
  const { wpm, setWordCount } = values;
  const options = useMemo(() => [10, 25, 50], []);
  return (
    <Container sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Container sx={{ display: 'flex', padding: 0 }}>
        {options.map((option, idx) => (
          <Fragment key={'box' + idx}>
            <Box
              sx={{
                margin: '0em .5em',
                marginLeft: idx === 0 ? '0' : '.5em',
                cursor: 'pointer',
              }}
              key={option + idx}
              onClick={() => {
                setWordCount(option);
                document.getElementsByTagName('button')[0].click();
              }}
            >
              {option}
            </Box>
            <Box key={'spacer' + idx}>{idx !== options.length - 1 && '/'}</Box>
          </Fragment>
        ))}
      </Container>
      <Box>{`WPM: ${wpm || ''}`}</Box>
    </Container>
  );
};

export default WordOptions;
