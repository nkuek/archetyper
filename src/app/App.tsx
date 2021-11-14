import { useContext, useEffect } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import { WordContext } from 'WordContext';
import Stats from 'components/Stats';
import { Container } from '@mui/material';

const App = () => {
  const values = useContext(WordContext);
  const { wpmData, wordCount, setFocused } = values;

  // handle pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        document.getElementsByTagName('button')[0].click();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <Container
      sx={{
        fontFamily: 'Roboto',
      }}
      onClick={() => setFocused(false)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
        }}
      >
        Typer
      </Box>
      <Container
        sx={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: wpmData.length === wordCount ? 'start' : 'center',
          justifyContent: 'center',
        }}
      >
        {wpmData.length === wordCount ? (
          <Stats />
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '75%',
              minHeight: '30%',
            }}
          >
            <>
              <WordOptions />
              <WordBox />
            </>
          </Box>
        )}
      </Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
        }}
      >
        themes
      </Box>
    </Container>
  );
};

export default App;
