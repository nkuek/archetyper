import React, { FC, useContext } from 'react';
import { IProps } from '../Settings';
import Dialog from 'components/Dialog';
import { Button } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeContext } from 'providers';

const aboutMeLinks = [
  {
    Icon: <LinkedInIcon fontSize="large" />,
    link: 'https://www.linkedin.com/in/nick-kuek/',
  },
  { Icon: <GitHubIcon fontSize="large" />, link: 'https://github.com/nkuek' },
  { Icon: <FolderSharedIcon fontSize="large" />, link: 'https://nkuek.dev/' },
];

const AboutMe: FC<IProps> = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Dialog open={open} onClose={onClose} title="about me">
      {aboutMeLinks.map(({ link, Icon }) => (
        <Button
          sx={{
            color: theme.headings,
            padding: 0,
          }}
          key={link}
        >
          <a
            style={{
              fontSize: '2em',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              padding: '.5em',
            }}
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            {Icon}
          </a>
        </Button>
      ))}
    </Dialog>
  );
};

export default AboutMe;
