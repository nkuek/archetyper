import React, { FC, useContext } from 'react';
import { IProps } from '../Settings';
import Dialog from 'components/Dialog';
import { IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GitHubIcon from '@mui/icons-material/GitHub';
import { ThemeContext } from 'providers';

const aboutMeLinks = [
  {
    Icon: <LinkedInIcon fontSize="inherit" />,
    link: 'https://www.linkedin.com/in/nick-kuek/',
  },
  {
    Icon: <GitHubIcon fontSize="inherit" />,
    link: 'https://github.com/nkuek/archetyper',
  },
  { Icon: <FolderSharedIcon fontSize="inherit" />, link: 'https://nkuek.dev/' },
];

const AboutMe: FC<IProps> = ({ open, onClose }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <Dialog open={open} onClose={onClose} title="about me">
      {aboutMeLinks.map(({ link, Icon }) => (
        <IconButton
          sx={{
            color: theme.headings,
            padding: 0,
          }}
          key={link}
          size="large"
        >
          <a
            style={{
              fontSize: '1.5em',
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
        </IconButton>
      ))}
    </Dialog>
  );
};

export default AboutMe;
