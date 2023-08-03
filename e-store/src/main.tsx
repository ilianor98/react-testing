// main.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';

// Use ReactDOM.render instead of ReactDOM.createRoot
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
