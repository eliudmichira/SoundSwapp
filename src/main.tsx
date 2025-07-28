import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupIframePolyfills } from './lib/polyfillInjector';

setupIframePolyfills(); // Initialize iframe polyfills early

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Dispatch app initialization event to hide preloader
setTimeout(() => {
  window.dispatchEvent(new CustomEvent('app-initialized', { 
    detail: { progress: 100 } 
  }));
  console.log('App initialization complete');
}, 100);