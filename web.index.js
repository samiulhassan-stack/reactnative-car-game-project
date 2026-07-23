/**
 * Web Entry point for the application
 * @format
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
