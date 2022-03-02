import { useMediaQuery, useTheme } from '@mui/material';
import { IProps } from 'components/WordBox';
import { FC, useEffect } from 'react';

export const useCapsLockListener = ({ setShowTip, setShowWarning }: IProps) => {
  const muiTheme = useTheme();
  const mobileDevice = useMediaQuery(muiTheme.breakpoints.down('sm'));

  useEffect(() => {
    const capsLockListener = (e: globalThis.KeyboardEvent) => {
      setShowWarning(!mobileDevice && e.getModifierState('CapsLock'));
      setShowTip(false);
    };
    window.addEventListener('keydown', capsLockListener);
    window.addEventListener('keyup', capsLockListener);
    return () => {
      window.removeEventListener('keydown', capsLockListener);
      window.removeEventListener('keyup', capsLockListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
