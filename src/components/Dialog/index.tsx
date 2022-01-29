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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions>
        <Button sx={{ color: theme.headings }} onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </MUIDialog>
  );
};

export default Dialog;