import React, { FC, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { themeList, ThemeContext } from 'providers';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const Themes: FC<IProps> = ({ open, onClose }) => {
  const { themeName, setThemeName } = useContext(ThemeContext);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>themes</DialogTitle>
      <DialogContent sx={{ display: 'flex' }}>
        {Object.keys(themeList).map((themeListItem) => {
          const theme = themeList[themeListItem];
          return (
            <div
              key={themeListItem}
              style={{
                padding: '.5em',
                display: 'flex',
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
                  width: 100,
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
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Themes;
