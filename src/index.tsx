import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { ThemeProvider, WordProvider, IndexProvider } from 'providers';

ReactDOM.render(
  <React.StrictMode>
    <IndexProvider>
      <WordProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </WordProvider>
    </IndexProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
