import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import {
  ThemeProvider,
  WordProvider,
  WordListProvider,
  IndexProvider,
  InputProvider,
  SettingsProvider,
} from 'providers';

ReactDOM.render(
  <React.StrictMode>
    <WordListProvider>
      <IndexProvider>
        <WordProvider>
          <ThemeProvider>
            <SettingsProvider>
              <InputProvider>
                <App />
              </InputProvider>
            </SettingsProvider>
          </ThemeProvider>
        </WordProvider>
      </IndexProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
