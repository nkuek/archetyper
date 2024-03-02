import { FC, ReactElement } from 'react';
import { Tooltip, Typography, styled } from '@mui/material';

const StyledTooltip = styled(Tooltip)({
  tooltip: {
    backgroundColor: '#1c1c1c',
    fontSize: '1em',
    top: -5,
    borderRadius: 5,
    padding: '.25em 1em',
  },
  arrow: {
    color: '#1c1c1c',
  },
});

const CustomTooltip: FC<{
  Title: string | (() => ReactElement);
  children: ReactElement;
}> = ({ Title, children }) => {
  return (
    <StyledTooltip
      disableInteractive
      arrow
      title={
        typeof Title === 'string' ? (
          <Typography sx={{ textAlign: 'center' }}>{Title}</Typography>
        ) : (
          <Title />
        )
      }
    >
      {children}
    </StyledTooltip>
  );
};

export default CustomTooltip;
