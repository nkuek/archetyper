import { FC, useContext } from 'react';
import { Box } from '@mui/system';
import { ThemeContext } from 'providers';

interface IProps {
  message: string | React.ReactNode;
}

const MessageOverlay: FC<IProps> = ({ message }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 10,
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'white',
        cursor: 'pointer',
        color: theme.words,
        backgroundColor: theme.wordBoxBackground,
      }}
    >
      {message}
    </Box>
  );
};

export default MessageOverlay;
