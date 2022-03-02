import React, { FC } from 'react';
import Dialog from 'components/Dialog';
import Themes from './Themes';
import Languages from './Languages';

export interface IProps {
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

const Settings: FC<IProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} title={'settings'}>
      <Themes />
      <Languages />
    </Dialog>
  );
};

export default Settings;
