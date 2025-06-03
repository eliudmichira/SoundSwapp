import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupIframePolyfills } from './lib/polyfillInjector';

setupIframePolyfills(); // Initialize iframe polyfills early

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);