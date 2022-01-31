import React, { FC, useState } from 'react';
import Dialog from 'components/Dialog';
import Themes from './Themes';
import Options from './Options';

export interface IProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const Settings: FC<IProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title={'settings'}>
      <Themes />
      <Options />
    </Dialog>
  );
};

export default Settings;
