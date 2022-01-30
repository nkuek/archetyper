import React, { FC, useContext } from 'react';
import { Button, Grid } from '@mui/material';
import { themeList, ThemeContext } from 'providers';
import Dialog from 'components/Dialog';

export interface IProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const Themes: FC<IProps> = ({ open, onClose }) => {
  const { themeName, setThemeName } = useContext(ThemeContext);
  return (
    <Dialog open={open} onClose={onClose} title="themes">
      <Grid container spacing={0}>
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
    </Dialog>
  );
};

export default Themes;
