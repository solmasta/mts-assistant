import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

window.React = React;
window.ReactDOM = ReactDOM;

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

const publicUrl = process.env.PUBLIC_URL || '';

const loadLegacyApp = () => loadScript(`${publicUrl}/app1.js`)
  .then(() => loadScript(`${publicUrl}/app2.js`))
  .then(() => loadScript(`${publicUrl}/app3.js`));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${publicUrl}/service-worker.js`)
      .then((reg) => console.log('✅ SW registered', reg.scope))
      .catch((err) => console.warn('SW registration failed', err));
  });
}

const hideSplash = () => {
  const splash = document.getElementById('splash');
  if (!splash) {
    return;
  }

  splash.style.opacity = '0';
  setTimeout(() => splash.remove(), 500);
};

const showLoadError = (error) => {
  const root = document.getElementById('root');
  if (!root) {
    return;
  }

  root.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:30px;text-align:center;background:#0a0a0a;font-family:sans-serif;color:#fff';
  root.innerHTML = `<div style="font-size:32px;margin-bottom:12px">Warning</div><div style="font-size:15px;font-weight:700;color:#E30613;margin-bottom:8px">App failed to load</div><div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:20px;max-width:300px;word-break:break-word">${error.message}</div><button onclick="location.reload()" style="background:#E30613;color:#fff;border:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:700;cursor:pointer">Reload</button>`;
};

// Auto-update check
Promise.all([
  loadLegacyApp().catch((error) => {
    showLoadError(error);
    throw error;
  }),
  fetch(`${publicUrl}/asset-manifest.json`)
  .then((res) => {
    if (!res.ok) {
      throw new Error('Failed to load asset manifest');
    }

    return res.json();
  })
  .catch(() => null),
])
  .catch(() => null)
  .finally(() => {
    setTimeout(hideSplash, 2500);
  });

// Import and render the main App component
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
