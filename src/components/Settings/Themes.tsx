import { Button, Grid, Typography } from '@mui/material';
import { ThemeContext, themeList } from 'providers';
import React, { useContext } from 'react';

const Themes = () => {
  const { themeName, setThemeName } = useContext(ThemeContext);

  return (
    <>
      <Typography sx={{ fontSize: '1.25rem' }}>themes</Typography>
      <Grid container spacing={0} sx={{ margin: '.5em 0' }}>
        {Object.keys(themeList).map((themeListItem) => {
          const theme = themeList[themeListItem];
          return (
            <Grid item sm={3} xs={4} key={themeListItem}>
              <div
                style={{
                  padding: '.5em',
                  display: 'flex',
                  justifyContent: 'center',
                  backgroundColor:
                    themeListItem === themeName ? 'lightgray' : '',
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
                    localStorage.setItem(
                      'typer-theme',
                      JSON.stringify(themeListItem)
                    );
                  }}
                >
                  {themeListItem}
                </Button>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Themes;
