import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { ThemeProvider, WordProvider, WordListProvider } from 'providers';

ReactDOM.render(
  <React.StrictMode>
    <WordListProvider>
      <WordProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </WordProvider>
    </WordListProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
