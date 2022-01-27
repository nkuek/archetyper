import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import themeList from 'providers/ThemeProvider/themeList';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const Themes: FC<IProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Theme</DialogTitle>
      <DialogContent>
        {Object.keys(themeList).map((theme) => (
          <Button
            key={theme}
            sx={{ background: themeList[theme].buttonBackground }}
          >
            {theme}
          </Button>
        ))}
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
