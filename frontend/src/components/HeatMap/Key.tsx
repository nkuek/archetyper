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
    heatMapData[primary] ||
    heatMapData[primary.toLowerCase()] ||
    (secondary && heatMapData[secondary]);

  const renderTooltip = () => {
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
          backgroundColor:
            heatMapData[primary]?.incorrect > 2 ||
            heatMapData[primary.toLowerCase()]?.incorrect > 2 ||
            (secondary && heatMapData[secondary]?.incorrect > 2)
              ? 'rgba(255, 0, 0, .6)'
              : heatMapData[primary]?.incorrect > 0 ||
                heatMapData[primary.toLowerCase()]?.incorrect > 0 ||
                (secondary && heatMapData[secondary]?.incorrect > 0)
              ? 'rgba(255, 165, 0, .6)'
              : heatMapData[primary] ||
                heatMapData[primary.toLowerCase()] ||
                (secondary && heatMapData[secondary])
              ? 'rgba(0, 155, 0, .3)'
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
                {primary.match(/^[A-Z]+$/) &&
                  heatMapData[primary.toLowerCase()] && (
                    <Box>{primary.toLowerCase()}</Box>
                  )}
                {heatMapData[primary] && <Box>{primary}</Box>}
                {secondary && heatMapData[secondary] && <Box>{secondary}</Box>}
              </Box>
              <Box>
                <Box sx={{ marginBottom: '.5em' }}>correct:</Box>
                {primary.match(/^[A-Z]+$/) &&
                  heatMapData[primary.toLowerCase()] && (
                    <Box>{heatMapData[primary.toLowerCase()].correct}</Box>
                  )}
                {heatMapData[primary] && (
                  <Box>{heatMapData[primary].correct}</Box>
                )}
                {secondary && heatMapData[secondary] && (
                  <Box>{heatMapData[secondary].correct}</Box>
                )}
              </Box>
              <Box>
                <Box sx={{ marginBottom: '.5em' }}>incorrect:</Box>
                {primary.match(/^[A-Z]+$/) &&
                  heatMapData[primary.toLowerCase()] && (
                    <Box>{heatMapData[primary.toLowerCase()].incorrect}</Box>
                  )}
                {heatMapData[primary] && (
                  <Box>{heatMapData[primary].incorrect}</Box>
                )}
                {secondary && heatMapData[secondary] && (
                  <Box>{heatMapData[secondary].incorrect}</Box>
                )}
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
