import { useEffect, FC, useContext } from 'react';
import WordBox from '../components/WordBox';
import Box from '@mui/material/Box';
import WordOptions from '../components/WordOptions';
import randomizedWords from '../words';
import { WordContext } from '../WordContext';

const App: FC = () => {
  const values = useContext(WordContext);
  const { wordCount, setWordList } = values;

  useEffect(() => {
    setWordList(randomizedWords(wordCount));
  }, [wordCount, setWordList]);

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '75%',
            minHeight: '30%',
          }}
        >
          <WordOptions />
          <WordBox />
        </Box>
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
