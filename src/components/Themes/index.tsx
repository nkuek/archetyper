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
  const { setThemeName } = useContext(ThemeContext);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Theme</DialogTitle>
      <DialogContent>
        {Object.keys(themeList).map((themeName) => {
          const theme = themeList[themeName];
          return (
            <Button
              key={themeName}
              sx={{ background: theme.buttonBackground, color: theme.words }}
              onClick={() => setThemeName(themeName)}
            >
              {themeName}
            </Button>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Themes;
