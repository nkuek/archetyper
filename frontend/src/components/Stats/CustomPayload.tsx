import { Box } from '@mui/material';
import { ThemeContext } from 'providers';
import { FC, useContext } from 'react';

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

export default CustomPayload;
