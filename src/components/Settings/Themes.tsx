import React, { useContext } from 'react';
import { Button, Grid } from '@mui/material';
import { ThemeContext } from 'providers';
import useThemeList from 'providers/ThemeProvider/useThemeList';
import SettingsWrapper from './SettingsWrapper';

const Themes = () => {
  const { themeName, setThemeName } = useContext(ThemeContext);

  const themeList = useThemeList();
  return (
    <SettingsWrapper title="themes">
      {Object.keys(themeList).map((themeListItem) => {
        const theme = themeList[themeListItem];
        return (
          <Grid item sm={3} xs={4} key={themeListItem}>
            <div
              style={{
                padding: '.5em',
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: themeListItem === themeName ? 'lightgray' : '',
                borderRadius: 2,
              }}
            >
              <Button
                key={themeListItem}
                disableRipple
                sx={{
                  padding: '1em 2em',
                  background: theme.buttonBackground,
                  color: theme.buttonText || theme.words,
                  '&.MuiButtonBase-root:hover': {
                    bgcolor: theme.buttonBackground,
                    transform: 'scale(105%)',
                  },
                  textTransform: 'lowercase',
                  border: theme.border || '',
                  width: '100%',
                }}
                onClick={() => {
                  setThemeName(themeListItem);
                }}
              >
                {themeListItem}
              </Button>
            </div>
          </Grid>
        );
      })}
    </SettingsWrapper>
  );
};

export default Themes;
