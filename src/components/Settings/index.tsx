import React, { FC } from 'react';
import Dialog from 'components/Dialog';
import Themes from './Themes';

export interface IProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const Settings: FC<IProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title={'settings'}>
      <Themes />
    </Dialog>
  );
};

export default Settings;
