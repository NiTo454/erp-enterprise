import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore: Ignorar la falta de declaración de tipos para archivos CSS
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
