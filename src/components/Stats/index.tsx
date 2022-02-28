import { FC, useContext, useEffect, useMemo } from 'react';
import { Container, Button, useTheme, useMediaQuery } from '@mui/material';
import { InputContext, SettingsContext, WordContext } from 'providers';
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
import { ThemeContext } from 'providers';
import { useReset } from 'hooks';
import DataDisplay from './DataDisplay';
import { default as MuiCustomTooltip } from 'components/CustomTooltip';
import { TWordChar } from 'providers/WordListProvider';

const CustomX = (props: any) => {
  if (!props.payload.errors) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="red"
      viewBox="0 0 20 20"
      x={props.x - 11}
      y={props.y - 11}
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
};

const CustomPayload: FC<{
  color: string;
  label: string;
  payload: any;
  line?: boolean;
  strike?: boolean;
  x?: boolean;
  underline?: boolean;
}> = ({ label, payload, color, line, strike, x, underline }) => {
  const legend = {
    height: line ? 2 : 10,
    width: 10,
    display: 'flex',
    justifyContent: 'center',
  };
  const { theme } = useContext(ThemeContext);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: theme.words,
      }}
    >
      <div style={{ display: 'flex' }}>
        {x ? (
          <Box sx={{ color, fontWeight: 'bold' }}>X</Box>
        ) : (
          <Box
            style={{
              backgroundColor: color,
              zIndex: 1,
              ...legend,
            }}
          >
            {(strike || underline) && (
              <Box
                sx={{
                  color,
                  textDecoration: `${
                    strike ? 'line-through' : 'underline'
                  } 2px red`,
                  position: 'relative',
                  fontSize: '1ch',
                  '&::before': {
                    content: '"-"',
                  },
                  '&::after': {
                    content: '"-"',
                  },
                }}
              >
                0
              </Box>
            )}
          </Box>
        )}
      </div>
      <p
        style={{
          margin: '0',
          padding: '3px 7.5px',
        }}
      >
        {`${label}: ${payload}`}
      </p>
    </div>
  );
};

const CustomTooltip = (props: any) => {
  const { payload, active } = props;
  const { theme } = useContext(ThemeContext);

  if (!active || !payload || !payload.length) return null;
  const payloadWrapperStyle = {
    background: theme.wordBoxBackground,
    borderRadius: 3,
    padding: '.5em',
    border: theme.border || `1px solid ${theme.graphText || theme.words}`,
  };
  return (
    <div>
      <div style={{ ...payloadWrapperStyle, height: 'fit-content' }}>
        <CustomPayload
          label="raw"
          payload={payload[0].payload.wpm.raw}
          color={payload[0].stroke}
          line
        />
        <CustomPayload
          label="wpm"
          payload={payload[0].payload.wpm.net}
          color={payload[1].stroke}
          line
        />
        {payload[0].payload.errors > 0 && (
          <CustomPayload
            label="errors"
            payload={payload[0].payload.errors}
            color={payload[2].fill}
            x
          />
        )}
      </div>
      <div style={{ ...payloadWrapperStyle, marginTop: '.5em' }}>
        <Box
          sx={{
            margin: '0 0',
            padding: '3px 7.5px',
            display: 'flex',
            justifyContent: 'center',
            fontSize: '1.2em',
            fontWeight: 'bold',
          }}
        >
          {payload[0].payload.word.map((char: TWordChar, idx: number) => (
            <Box
              key={char.char + idx}
              sx={{
                color: char.mistyped
                  ? theme.incorrect ?? 'red'
                  : char.extra
                  ? theme.currentWord
                  : char.skipped
                  ? theme.words
                  : theme.correct,
                textDecoration: char.skipped
                  ? 'underline red 2px'
                  : char.extra
                  ? 'line-through red 1px'
                  : 'none',
              }}
            >
              {char.char}
            </Box>
          ))}
        </Box>
        {payload[0].payload.incorrectChars > 0 && (
          <CustomPayload
            label="incorrect"
            payload={payload[0].payload.incorrectChars}
            color={payload[2].fill}
          />
        )}
        {payload[0].payload.extraChars > 0 && (
          <CustomPayload
            label="extra"
            payload={payload[0].payload.extraChars}
            color={theme.currentWord}
            strike
          />
        )}
        {payload[0].payload.missingChars > 0 && (
          <CustomPayload
            label="missing"
            payload={payload[0].payload.missingChars}
            color={theme.words}
            underline
          />
        )}
      </div>
    </div>
  );
};

const Stats = () => {
  const { wpmData, wordBoxConfig } = useContext(WordContext);
  const { settings } = useContext(SettingsContext);
  const { timer, wpm } = useContext(InputContext);

  const { theme } = useContext(ThemeContext);
  const muiTheme = useTheme();
  const smallScreen = useMediaQuery(muiTheme.breakpoints.down(500));

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
        sx={{
          color: theme.headings,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box textAlign="center" fontSize="1.5em">
          wpm:
        </Box>
        <MuiCustomTooltip title="wpm with uncorrected errors">
          <Box textAlign="center" fontSize="2em">
            {wpm.net}
          </Box>
        </MuiCustomTooltip>
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
        <MuiCustomTooltip title={`${(accuracy * 100).toFixed(2)}%`}>
          <Box textAlign="center" fontSize="2em">{`${Math.round(
            Math.floor(accuracy * 100)
          )}%`}</Box>
        </MuiCustomTooltip>
      </Container>
      <Container
        sx={{
          backgroundColor: theme.wordBoxBackground,
          padding: '2em 1em',
          borderRadius: 2,
          border: theme.border,
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
          flexDirection: smallScreen ? 'column' : 'row',
        }}
      >
        <DataDisplay
          title="raw"
          data={wpm.raw}
          tooltip="wpm without uncorrected errors"
        />
        <DataDisplay
          title="characters"
          tooltip="typed / incorrect / missing / extra"
          data={`${wordBoxConfig.charCount} / ${totalErrors.incorrectChars} / ${totalErrors.missingChars} / ${totalErrors.extraChars}`}
        />
        <DataDisplay
          title="time"
          data={settings.type === 'timed' ? timer._time : timer.time}
          unit="s"
        />
      </Container>
      <Container
        sx={{
          color: theme.currentWord,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <MuiCustomTooltip title="restart test">
          <Button
            sx={{ color: theme.buttonText || theme.currentWord }}
            onClick={handleReset}
          >
            <ReplayIcon />
          </Button>
        </MuiCustomTooltip>
      </Container>
    </Container>
  );
};

export default Stats;
