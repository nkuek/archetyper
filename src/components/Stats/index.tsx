import { useContext, useMemo } from 'react';
import { Container, Button } from '@mui/material';
import { WordContext } from 'WordContext';
import { Box } from '@mui/system';
import randomizeWords from 'words';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Tooltip as MuiTooltip } from '@mui/material';

const CustomTooltip = (props: any) => {
  const { payload } = props;

  return (
    <div
      style={{
        border: '#bbb 1.5px solid',
      }}
    >
      <p
        style={{
          margin: '0 0',
          padding: '3px 7.5px',
          backgroundColor: 'white',
          textAlign: 'center',
        }}
      >
        {payload[0] && payload[0].payload.word}
      </p>
      <p
        style={{
          margin: '0 0',
          padding: '3px 7.5px',
          backgroundColor: 'white',
        }}
      >{`WPM: ${payload[0] && payload[0].payload.wpm}`}</p>
      <p
        style={{
          margin: '0 0',
          padding: '3px 7.5px',
          backgroundColor: 'white',
        }}
      >{`Errors: ${payload[0] && payload[0].payload.errors}`}</p>
    </div>
  );
};

const Stats = () => {
  const values = useContext(WordContext);
  const {
    wpm,
    wordCount,
    setWordList,
    setWpmData,
    wpmData,
    wordList,
    setWpm,
    setTimer,
    setTimerId,
    timer,
    setFocused,
  } = values;

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setWordList(randomizeWords(wordCount));
    setWpmData([]);
    setWpm(0);
    setTimer(1);
    setTimerId(null);
    setFocused(true);
  };

  const totalChars = useMemo(
    () => wordList.reduce((acc, word) => acc + word.length, 0),
    [wordList]
  );

  const totalErrors = useMemo(() => {
    const total = {
      errors: 0,
      missingChars: 0,
      incorrectChars: 0,
      extraChars: 0,
    };

    wpmData.forEach((dataPoint) => {
      total.errors += dataPoint.errors;
      total.missingChars += dataPoint.missingChars;
      total.incorrectChars += dataPoint.incorrectChars;
      total.extraChars += dataPoint.extraChars;
    });
    return total;
  }, [wpmData]);

  const accuracy = useMemo(() => {
    return (totalChars - totalErrors.errors) / totalChars;
  }, [totalChars, totalErrors]);

  return (
    <Container
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box textAlign="center" fontSize="1.5em">
          wpm:
        </Box>
        <Box textAlign="center" fontSize="2em">
          {wpm}
        </Box>
      </Container>
      <Container
        sx={{ display: 'flex', flexDirection: 'column', marginBottom: '1em' }}
      >
        <Box textAlign="center" fontSize="1.5em">
          accuracy:
        </Box>
        <MuiTooltip title={`${(accuracy * 100).toFixed(2)}%`} arrow>
          <Box textAlign="center" fontSize="2em">{`${Math.round(
            Math.floor(accuracy * 100)
          )}%`}</Box>
        </MuiTooltip>
      </Container>
      <ResponsiveContainer width={'100%'} height={250}>
        <LineChart margin={{ right: 20 }} data={wpmData}>
          <CartesianGrid />
          <XAxis dataKey="wordNum" />
          <YAxis
            label={{
              value: 'words per minute',
              angle: -90,
              dx: -15,
            }}
            dataKey="wpm"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={'wpm'} />
        </LineChart>
      </ResponsiveContainer>
      <Container
        sx={{
          display: 'flex',
          padding: 0,
        }}
      >
        <Container sx={{ width: 'fit-content' }}>
          <Box fontSize="1.1em">characters:</Box>
          <MuiTooltip title="total / incorrect / missing / extra" arrow>
            <Box fontSize="1.5em">{`${totalChars} / ${totalErrors.incorrectChars} / ${totalErrors.missingChars} / ${totalErrors.extraChars}`}</Box>
          </MuiTooltip>
        </Container>
        <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
          <Box fontSize="1.1em">time:</Box>
          <Box fontSize="1.5em">{`${timer}s`}</Box>
        </Container>
      </Container>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={handleReset}>
          <ReplayIcon />
        </Button>
      </Container>
    </Container>
  );
};

export default Stats;
