import { Box } from '@mui/material';
import CustomTooltip from 'components/CustomTooltip';
import { ThemeContext, WordContext } from 'providers';
import React, { FC, useContext } from 'react';
import { IKey } from './KeyRow';

const Key: FC<{ keyProp: IKey }> = ({ keyProp }) => {
  const { primary, secondary, modifier, size = 1 } = keyProp;

  const letterProps = { marginLeft: '.2rem', fontSize: '.8em' } as const;

  const { theme } = useContext(ThemeContext);
  const { heatMapData } = useContext(WordContext);

  const displayTooltip =
    heatMapData[primary.toLowerCase()] ||
    (secondary && heatMapData[secondary.toLowerCase()]);

  const renderTooltip = () => {
    console.log(heatMapData[primary], heatMapData[primary.toLowerCase()]);
    const children = (
      <Box
        sx={{
          border: `1px solid ${theme.headings}`,
          color: theme.words,
          margin: '.15rem',
          borderRadius: 1,
          boxSizing: 'border-box',
          paddingBottom: '.2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: modifier ? 'center' : 'normal',
          fontSize: secondary || modifier ? '1.2em' : '1.5em',
          width: 45 * size,
          height: 45,
          opacity:
            heatMapData[primary]?.incorrect ||
            heatMapData[primary.toLowerCase()]?.incorrect ||
            (secondary && heatMapData[secondary]?.incorrect)
              ? 0.7
              : 1,
          backgroundColor:
            heatMapData[primary]?.incorrect > 3 ||
            heatMapData[primary.toLowerCase()]?.incorrect > 3 ||
            (secondary && heatMapData[secondary]?.incorrect > 3)
              ? 'red'
              : heatMapData[primary]?.incorrect > 0 ||
                heatMapData[primary.toLowerCase()]?.incorrect > 0 ||
                (secondary && heatMapData[secondary]?.incorrect > 0)
              ? 'orange'
              : 'inherit',
        }}
      >
        {secondary && <Box sx={letterProps}>{secondary}</Box>}
        <Box sx={letterProps}>{primary}</Box>
      </Box>
    );
    if (!displayTooltip) return children;
    return (
      <CustomTooltip
        Title={() => (
          <Box>
            <Box
              sx={{
                display: 'flex',
                '& > div': {
                  padding: '.5em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                },
              }}
            >
              <Box>
                <Box sx={{ marginBottom: '.5em' }}>key:</Box>
                <Box>{primary.toLowerCase()}</Box>
                {heatMapData[primary] && <Box>{primary}</Box>}
                {secondary && <Box>{secondary}</Box>}
              </Box>
              <Box>
                <Box sx={{ marginBottom: '.5em' }}>correct:</Box>
                <Box>{heatMapData[primary.toLowerCase()].correct}</Box>
                {heatMapData[primary] && (
                  <Box>{heatMapData[primary].correct}</Box>
                )}
                {secondary && <Box>{heatMapData[secondary].correct}</Box>}
              </Box>
              <Box>
                <Box sx={{ marginBottom: '.5em' }}>incorrect:</Box>
                <Box>{heatMapData[primary.toLowerCase()].incorrect}</Box>
                {heatMapData[primary] && (
                  <Box>{heatMapData[primary].incorrect}</Box>
                )}
                {secondary && <Box>{heatMapData[secondary].incorrect}</Box>}
              </Box>
            </Box>
          </Box>
        )}
      >
        {children}
      </CustomTooltip>
    );
  };

  return renderTooltip();
};

export default Key;
