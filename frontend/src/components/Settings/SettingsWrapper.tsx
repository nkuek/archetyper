import React, { FC } from 'react';
import { Grid, Typography } from '@mui/material';
import CustomTooltip from 'components/CustomTooltip';

const SettingsWrapper: FC<{ title: string; tooltip?: string }> = ({
  title,
  children,
  tooltip,
}) => {
  const renderTitle = () => {
    const defaultTitle = (
      <Typography sx={{ fontSize: '1.25rem', width: 'fit-content' }}>
        {title}
      </Typography>
    );
    if (!tooltip) return defaultTitle;
    return <CustomTooltip Title={tooltip}>{defaultTitle}</CustomTooltip>;
  };
  return (
    <>
      {renderTitle()}
      <Grid container spacing={0} sx={{ margin: '1em 0' }}>
        {children}
      </Grid>
    </>
  );
};

export default SettingsWrapper;
