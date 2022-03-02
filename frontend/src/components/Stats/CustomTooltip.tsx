import { Box } from '@mui/material';
import { ThemeContext } from 'providers';
import { TWordChar } from 'providers/WordListProvider';
import { useContext } from 'react';
import CustomPayload from './CustomPayload';

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
      <div style={payloadWrapperStyle}>
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
      <div
        style={{
          ...payloadWrapperStyle,
          height: 'fit-content',
          marginTop: '.5em',
        }}
      >
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
    </div>
  );
};

export default CustomTooltip;
