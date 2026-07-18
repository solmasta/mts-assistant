import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

function loadAppScripts() {
  const loadScript = (src) => new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.body.appendChild(script);
  });

  return loadScript('https://unpkg.com/react@18.2.0/umd/react.production.min.js')
    .then(() => loadScript('https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js'))
    .then(() => Promise.all(['app1.js', 'app2.js', 'app3.js'].map(loadScript)));
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div style={{ width: '100%', height: '100%' }}>
    {/* Your app will load here */}
  </div>
);

loadAppScripts()
  .catch((error) => {
    console.error('Failed to load app scripts:', error);
  });

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
