import React, { FC, ReactElement } from 'react';
import { Tooltip, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';

const StyledTooltip = withStyles(() => ({
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
