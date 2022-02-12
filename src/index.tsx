import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import {
  ThemeProvider,
  WordProvider,
  WordListProvider,
  TimeProvider,
  IndexProvider,
} from 'providers';

ReactDOM.render(
  <React.StrictMode>
    <WordListProvider>
      <IndexProvider>
        <WordProvider>
          <ThemeProvider>
            <TimeProvider>
              <App />
            </TimeProvider>
          </ThemeProvider>
        </WordProvider>
      </IndexProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
