import { useContext, useEffect, useMemo } from 'react';
import { Container, Button } from '@mui/material';
import { TimeContext, WordContext } from 'providers';
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
  Legend,
} from 'recharts';
import { Tooltip as MuiTooltip } from '@mui/material';
import { ThemeContext } from 'providers';
import { useReset } from 'hooks';
import DataDisplay from './DataDisplay';
import _ from 'lodash';

const CustomX = (props: any) => {
  if (!props.payload.errors) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="red"
      // className="bi bi-x"
      viewBox="0 0 20 20"
      x={props.x - 11}
      y={props.y - 11}
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
};

const CustomTooltip = (props: any) => {
  const { payload, active } = props;
  const { theme } = useContext(ThemeContext);

  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: theme.wordBoxBackground,
        borderRadius: 3,
        padding: '.5em',
        border: `1px solid ${theme.graphText || theme.words}`,
      }}
    >
      <p
        style={{
          margin: '0 0',
          padding: '3px 7.5px',
          textAlign: 'center',
          color: theme.currentWord,
        }}
      >
        {payload[0].payload.word}
      </p>
      {payload.map((data: any) => (
        <div
          key={data.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            color: theme.words,
          }}
        >
          <div
            style={{
              backgroundColor: data.stroke || data.fill,
              height: 10,
              width: 10,
            }}
          ></div>
          <p
            style={{
              margin: '0 0',
              padding: '3px 7.5px',
            }}
          >
            {`${data.name}: ${_.get(payload[0].payload, data.dataKey)}`}
          </p>
        </div>
      ))}
    </div>
  );
};

const Stats = () => {
  const { wpm, wpmData, wordBoxConfig } = useContext(WordContext);
  const { timer } = useContext(TimeContext);

  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (timer.id) {
      clearInterval(timer.id);
    }
  }, [timer.id]);

  const handleReset = useReset(true);

  const totalErrors = useMemo(() => {
    const total = {
      errors: 0,
      missingChars: 0,
      incorrectChars: 0,
      extraChars: 0,
    };

    Object.values(wpmData).forEach((value) => {
      total.errors += value.errors;
      total.missingChars += value.missingChars;
      total.incorrectChars += value.incorrectChars;
      total.extraChars += value.extraChars;
    });
    return total;
  }, [wpmData]);

  const accuracy = useMemo(() => {
    return Math.max(
      (wordBoxConfig.charCount - totalErrors.errors) / wordBoxConfig.charCount,
      0
    );
  }, [wordBoxConfig.charCount, totalErrors]);

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
        <MuiTooltip title="wpm factoring in uncorrected errors" arrow>
          <Box textAlign="center" fontSize="2em">
            {wpm.net}
          </Box>
        </MuiTooltip>
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
          <ComposedChart
            margin={{
              top: 5,
              right: 30,
              left: 30,
              bottom: 5,
            }}
            data={Object.values(wpmData)}
          >
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
              allowDecimals={false}
              stroke={theme.cartesian}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ paddingBottom: '1em' }}
            />
            <Line
              name="raw"
              yAxisId="left"
              type="monotone"
              dataKey="wpm.raw"
              dot={false}
              stroke={theme.lineColor2 || theme.headings}
              strokeWidth={2}
              legendType="plainline"
            />
            <Line
              name="wpm"
              yAxisId="left"
              type="monotone"
              dataKey="wpm.net"
              dot={false}
              stroke={theme.lineColor}
              strokeWidth={2}
              legendType="plainline"
            />
            <Scatter
              name="errors"
              legendType="none"
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
          justifyContent: 'center',
        }}
      >
        <DataDisplay
          title="raw"
          data={wpm.raw}
          tooltip="wpm without factoring in uncorrected errors"
        />
        <DataDisplay
          title="characters"
          tooltip="total characters typed / incorrect / missing / extra"
          data={`${wordBoxConfig.charCount} / ${totalErrors.incorrectChars} / ${totalErrors.missingChars} / ${totalErrors.extraChars}`}
        />
        <DataDisplay title="time" data={timer.time} unit="s" />
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
