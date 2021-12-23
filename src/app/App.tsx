import { useContext, useEffect } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import { WordContext } from 'WordContext';
import Stats from 'components/Stats';
import { Container } from '@mui/material';

const App = () => {
  const { wpmData, wordCount, setFocused } = useContext(WordContext);

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
        overflowY: 'scroll',
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
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: wpmData.length === wordCount ? 'start' : 'center',
          justifyContent: 'center',
          padding: 0,
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
