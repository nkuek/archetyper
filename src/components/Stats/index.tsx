import { useContext, useEffect, useMemo } from 'react';
import { Container, Button } from '@mui/material';
import { WordContext } from 'providers/WordProvider';
import { Box } from '@mui/system';
import ReplayIcon from '@mui/icons-material/Replay';
import {
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Scatter,
  Label,
} from 'recharts';
import { Tooltip as MuiTooltip } from '@mui/material';
import { ThemeContext } from 'providers';
import { useReset } from 'hooks';

const CustomX = (props: any) => {
  if (!props.payload.errors) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="red"
      className="bi bi-x"
      viewBox="0 0 16 16"
      x={props.x - 4}
      y={props.y + -4}
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
};

const CustomTooltip = (props: any) => {
  const { payload } = props;
  const { theme } = useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: theme.pageBackground,
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
  const { wpm, wpmData, wordList, timerId, timer } = values;

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (timerId) {
      clearInterval(timerId);
    }
  }, [timerId]);

  const handleReset = useReset();

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
      <Container
        sx={{ color: theme.headings, display: 'flex', flexDirection: 'column' }}
      >
        <Box textAlign="center" fontSize="1.5em">
          wpm:
        </Box>
        <Box textAlign="center" fontSize="2em">
          {wpm}
        </Box>
      </Container>
      <Container
        sx={{
          color: theme.headings,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '1em',
        }}
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
      <Container
        sx={{
          backgroundColor: theme.wordBoxBackground,
          padding: '2em 1em',
          borderRadius: 2,
        }}
      >
        <ResponsiveContainer width={'100%'} height={250}>
          <ComposedChart margin={{ right: 20 }} data={wpmData}>
            <CartesianGrid stroke={theme.cartesian || theme.words} />
            <XAxis height={40} dataKey="wordNum" stroke={theme.cartesian}>
              <Label
                value="words"
                fill={theme.graphText || theme.words}
                position="insideBottom"
              />
            </XAxis>
            <YAxis
              yAxisId="left"
              label={{
                value: 'words per minute',
                angle: -90,
                dx: -20,
                fill: theme.graphText || theme.words,
              }}
              dataKey="wpm"
              type="number"
              stroke={theme.cartesian}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'errors',
                angle: 90,
                dx: 5,
                fill: theme.graphText || theme.words,
              }}
              dataKey="errors"
              domain={[0, 'dataMax + 1']}
              allowDecimals={false}
              type="number"
              stroke={theme.cartesian}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="wpm"
              dot={false}
              stroke={theme.lineColor}
              strokeWidth={2}
            />
            <Scatter
              yAxisId="right"
              type="monotone"
              dataKey="errors"
              fill="red"
              shape={<CustomX />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Container>
      <Container
        sx={{
          display: 'flex',
          padding: 0,
          marginTop: '1em',
        }}
      >
        <Container sx={{ color: theme.headings, width: 'fit-content' }}>
          <Box fontSize="1.1em">characters:</Box>
          <MuiTooltip title="total / incorrect / missing / extra" arrow>
            <Box fontSize="1.5em">{`${totalChars} / ${totalErrors.incorrectChars} / ${totalErrors.missingChars} / ${totalErrors.extraChars}`}</Box>
          </MuiTooltip>
        </Container>
        <Container
          sx={{
            color: theme.headings,
            width: 'fit-content',
            marginBottom: '1em',
          }}
        >
          <Box fontSize="1.1em">time:</Box>
          <Box fontSize="1.5em">{`${timer}s`}</Box>
        </Container>
      </Container>
      <Container
        sx={{
          color: theme.currentWord,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button sx={{ color: theme.buttonText }} onClick={handleReset}>
          <ReplayIcon />
        </Button>
      </Container>
    </Container>
  );
};

export default Stats;
