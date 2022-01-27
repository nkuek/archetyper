import { useContext, useEffect, useState } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import { WordContext } from 'providers/WordProvider';
import Stats from 'components/Stats';
import { Container, Typography } from '@mui/material';
import Themes from 'components/Themes';

const App = () => {
  const { wpmData, wordCount, setFocused } = useContext(WordContext);

  const [dialogOpen, setDialogOpen] = useState(false);

  const closeDialog = () => {
    setDialogOpen(false);
  };

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
        <Typography
          onClick={() => setDialogOpen(true)}
          sx={{
            cursor: 'pointer',
            backgroundImage: 'linear-gradient(90deg, red, blue)',
            backgroundSize: `${dialogOpen ? 100 : 0}% 3px`,
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
            transition: 'background-size 300ms ease-in-out',
            '&:hover': {
              backgroundSize: '100% 3px',
            },
          }}
        >
          themes
        </Typography>
      </Box>
      <Themes open={dialogOpen} onClose={closeDialog} />
    </Container>
  );
};

export default App;
