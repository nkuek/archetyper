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
  } = values;

  const handleReset = () => {
    setWordList(randomizeWords(wordCount));
    setWpmData([]);
    setWpm(0);
    setTimer(1);
    setTimerId(null);
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
    const _percentage = (totalChars - totalErrors.errors) / totalChars;
    return Math.floor(_percentage * 100);
  }, [totalChars, totalErrors]);

  return (
    <Container sx={{ width: '100%' }}>
      <Box>{`WPM: ${wpm}`}</Box>
      <Box>{`Accuracy: ${accuracy}%`}</Box>
      <Box>{`Total Errors: ${totalErrors.errors}`}</Box>
      <Box>{`Total Characters: ${totalChars}`}</Box>
      <Box>{`Incorrect Characters: ${totalErrors.incorrectChars}`}</Box>
      <Box>{`Missing Characters: ${totalErrors.missingChars}`}</Box>
      <Box>{`Extra Characters: ${totalErrors.extraChars}`}</Box>
      <ResponsiveContainer width={'100%'} height={250}>
        <LineChart data={wpmData}>
          <CartesianGrid />
          <XAxis dataKey="wordNum" />
          <YAxis
            label={{
              value: 'Words per Minute',
              angle: -90,
              dx: -15,
            }}
            dataKey="wpm"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey={'wpm'} />
        </LineChart>
      </ResponsiveContainer>
      <Button onClick={handleReset}>
        <ReplayIcon />
      </Button>
    </Container>
  );
};

export default Stats;
