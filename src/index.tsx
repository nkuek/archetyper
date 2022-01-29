import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { ThemeProvider, WordProvider } from 'providers';

ReactDOM.render(
  <React.StrictMode>
    <WordProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </WordProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
