import {
  Button,
  Dialog as MUIDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { ThemeContext } from 'providers';
import React, { FC, useContext } from 'react';

interface IProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  title: string;
}

const Dialog: FC<IProps> = ({ open, onClose, title, children }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <MUIDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: theme.pageBackground,
          color: theme.headings,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ fontSize: '1.5rem' }}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          sx={{ color: theme.headings, textTransform: 'lowercase' }}
          onClick={onClose}
        >
          close
        </Button>
      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;
