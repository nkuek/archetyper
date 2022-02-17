import React, { FC, useContext } from 'react';
import {
  defaultSettings,
  ISettings,
  wordOptions,
} from 'providers/WordProvider';
import useWordOptionTheme from './styles';
import { WordContext } from 'providers';
import { useFocus, useLocalStorage } from 'hooks';
import { Box } from '@mui/system';

interface IProps {
  type: ISettings['type'];
}

const WordTypeOptions: FC<IProps> = ({ type }) => {
  const { getOptionStyle, optionContainerStyle } = useWordOptionTheme(type);
  const { setLocalStorage } = useLocalStorage(
    'typer-settings',
    defaultSettings
  );
  const { settings, setSettings } = useContext(WordContext);

  const focus = useFocus();

  return (
    <div style={{ display: 'flex' }}>
      {wordOptions.map((setting, idx) => (
        <div style={optionContainerStyle} key={setting.value + idx}>
          <Box
            sx={{
              display: 'flex',
              ...getOptionStyle(settings[setting.value]),
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSettings((prev) => ({
                ...prev,
                [setting.value]: !prev[setting.value],
              }));
              setLocalStorage({
                ...settings,
                [setting.value]: !settings[setting.value],
              });
              focus();
            }}
          >
            {setting.name}
          </Box>
        </div>
      ))}
    </div>
  );
};

export default WordTypeOptions;