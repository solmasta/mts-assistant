import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
    .catch(() => null);

  if ('caches' in window) {
    caches.keys()
      .then((cacheNames) => Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName))))
      .catch(() => null);
  }
}

const hideSplash = () => {
  const splash = document.getElementById('splash');
  if (!splash) {
    return;
  }

  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 500);
};

// Auto-update check
fetch(`${process.env.PUBLIC_URL || ''}/asset-manifest.json`)
  .then((res) => {
    if (!res.ok) {
      throw new Error('Failed to load asset manifest');
    }

    return res.json();
  })
  .catch(() => null)
  .finally(() => {
    setTimeout(hideSplash, 2000);
  });
