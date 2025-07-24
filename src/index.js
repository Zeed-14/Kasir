import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// --- PERBAIKAN DI SINI ---
// Impor dari file yang benar: serviceWorkerRegistration
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Panggil fungsi register dari file yang benar
serviceWorkerRegistration.register();