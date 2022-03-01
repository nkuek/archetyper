import { useContext, useEffect, useMemo } from 'react';
import { Container, Button, Box, useMediaQuery } from '@mui/material';
import { InputContext, SettingsContext, WordContext } from 'providers';
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
import CustomX from './CustomX';
import CustomTooltip from './CustomTooltip';
import HeatMap from 'components/HeatMap';
import { useTheme } from '@mui/system';

const Stats = () => {
  const { wpmData, wordBoxConfig } = useContext(WordContext);
  const { settings } = useContext(SettingsContext);
  const { timer, wpm } = useContext(InputContext);

  const { theme } = useContext(ThemeContext);
  const muiTheme = useTheme();
  const smallScreen = useMediaQuery(muiTheme.breakpoints.down(600));

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
        <Box textAlign="center" fontSize="clamp(1em, 4vw + .5em, 1.5em)">
          wpm:
        </Box>
        <MuiCustomTooltip title="wpm with uncorrected errors">
          <Box textAlign="center" fontSize="clamp(1em, 4vw + .5em, 2em)">
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
        <Box textAlign="center" fontSize="clamp(1em, 5vw + .5em, 1.5em)">
          accuracy:
        </Box>
        <MuiCustomTooltip title={`${(accuracy * 100).toFixed(2)}%`}>
          <Box
            textAlign="center"
            fontSize="clamp(1em, 5vw + .5em, 2em)"
          >{`${Math.round(Math.floor(accuracy * 100))}%`}</Box>
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
            <ReplayIcon fontSize="large" />
          </Button>
        </MuiCustomTooltip>
      </Container>
      {!smallScreen && <HeatMap />}
    </Container>
  );
};

export default Stats;
