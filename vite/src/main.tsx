import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style/index.css';

export const domainName = "localhost:8080";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
