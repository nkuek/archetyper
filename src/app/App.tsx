import { useContext, useEffect, useState } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import { WordContext, ThemeContext } from 'providers';
import Stats from 'components/Stats';
import { Container, Typography } from '@mui/material';
import Themes from 'components/Themes';

const App = () => {
  const { wpmData, wordCount, setFocused } = useContext(WordContext);
  const { theme } = useContext(ThemeContext);

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
    <div
      style={{
        fontFamily: 'Roboto',
        background: theme.pageBackground,
      }}
      onClick={() => setFocused(false)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 40,
          fontSize: 'clamp(2rem, 5vw + .5rem, 3rem)',
          top: '1rem',
          position: 'relative',
          color: theme.headings || theme.currentWord,
        }}
      >
        typer
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
            backgroundImage: `linear-gradient(90deg, ${
              (theme.gradientUnderline && theme.gradientUnderline[0]) || 'red'
            }, ${
              (theme.gradientUnderline && theme.gradientUnderline[1]) || 'blue'
            })`,
            backgroundSize: `${dialogOpen ? 100 : 0}% 3px`,
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
            transition: 'background-size 300ms ease-in-out',
            '&:hover': {
              backgroundSize: '100% 3px',
            },
            fontSize: 'clamp(1rem, 5vw + .25rem, 1.5rem)',
            color: theme.headings || theme.currentWord,
            position: 'relative',
            bottom: '1rem',
          }}
        >
          themes
        </Typography>
      </Box>
      <Themes open={dialogOpen} onClose={closeDialog} />
    </div>
  );
};

export default App;
