import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ThemeProvider } from './context/ThemeContext'; // <-- IMPORT BARU

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider> {/* <-- BUNGKUS APP DI SINI */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();