import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

export const domainName = 'made-f0br8s6:8080';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

export const client = axios.create({
  baseURL: `http://${domainName}/api`,
});

export interface UserEntity {
  id: number;
  email: string;
  picture: string;
  password: string;
}
