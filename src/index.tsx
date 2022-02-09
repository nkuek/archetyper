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
      <WordProvider>
        <ThemeProvider>
          <TimeProvider>
            <IndexProvider>
              <App />
            </IndexProvider>
          </TimeProvider>
        </ThemeProvider>
      </WordProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
