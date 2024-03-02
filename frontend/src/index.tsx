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
import { Analytics } from '@vercel/analytics/react';

ReactDOM.render(
  <React.StrictMode>
    <WordListProvider>
      <IndexProvider>
        <WordProvider>
          <ThemeProvider>
            <SettingsProvider>
              <InputProvider>
                <App />
                <Analytics />
              </InputProvider>
            </SettingsProvider>
          </ThemeProvider>
        </WordProvider>
      </IndexProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
