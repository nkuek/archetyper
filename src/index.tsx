import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { ThemeProvider, WordProvider, WordListProvider } from 'providers';
import TimeProvider from 'providers/TimeProvider';

ReactDOM.render(
  <React.StrictMode>
    <WordListProvider>
      <WordProvider>
        <TimeProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </TimeProvider>
      </WordProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
