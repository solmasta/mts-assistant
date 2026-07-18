import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

// Your app1.js content will be imported here
// For now, let's create a basic app that loads your existing code

const root = ReactDOM.createRoot(document.getElementById('root'));

// Simple loader that shows your app
root.render(
  <div style={{width: '100%', height: '100%'}}>
    {/* Your app will load here */}
  </div>
);

// Auto-update check
fetch('build/asset-manifest.json')
  .then(res => res.json())
  .then(data => {
    const currentVersion = '1.4.4';
    const buildVersion = data.files['main.js']?.match(/[?&]v=([^&]+)/)?.[1];
    
    if (buildVersion && buildVersion !== currentVersion && !navigator.serviceWorker.controller) {
      document.getElementById('splash-status').textContent = 'MTS ASSISTANT · UPDATING';
      setTimeout(() => window.location.reload(true), 1000);
    }
  })
  .catch(() => {
    setTimeout(() => {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }
    }, 3000);
  });
