import { useContext, useEffect } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import { WordContext } from 'WordContext';
import Stats from 'components/Stats';

const App = () => {
  const values = useContext(WordContext);
  const { wpmData, wordCount } = values;
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
    <Box
      sx={{
        fontFamily: 'Roboto',
      }}
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
      <Box
        sx={{
          height: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
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
      </Box>
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
    </Box>
  );
};

export default App;
