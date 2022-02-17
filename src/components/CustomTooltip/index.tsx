import React, { FC, ReactElement } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#333',
    fontSize: '1em',
    top: -5,
  },
  arrow: {
    color: '#333',
  },
}))(Tooltip);

const CustomTooltip: FC<{ title: string; children: ReactElement }> = ({
  title,
  children,
}) => {
  return (
    <StyledTooltip
      arrow
      title={<Typography sx={{ textAlign: 'center' }}>{title}</Typography>}
    >
      {children}
    </StyledTooltip>
  );
};

export default CustomTooltip;
