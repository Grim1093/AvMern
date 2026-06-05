console.log('[React Step 1] Bootstrapping React application...');
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

console.log('[React Step 2] Rendering root component to the DOM...');
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);