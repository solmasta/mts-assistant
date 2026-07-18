import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [appLoaded, setAppLoaded] = React.useState(false);

  // Load legacy app modules
  React.useEffect(() => {
    // Make React globally available for legacy app modules
    window.React = React;
    window.ReactDOM = ReactDOM;
    console.log('✅ React and ReactDOM injected to window');

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
        console.log(`✅ Loaded: ${src}`);
        resolve();
      }, { once: true });
      script.addEventListener('error', () => {
        console.error(`❌ Failed to load: ${src}`);
        reject(new Error(`Failed to load ${src}`));
      }, { once: true });
      document.body.appendChild(script);
    });

    const publicUrl = process.env.PUBLIC_URL || '';
    const loadLegacyApp = () => {
      console.log('📦 Starting to load legacy apps...');
      return loadScript(`${publicUrl}/app1.js`)
        .then(() => loadScript(`${publicUrl}/app2.js`))
        .then(() => loadScript(`${publicUrl}/app3.js`))
        .then(() => {
          console.log('✅ All scripts loaded. Checking for window.App1...');
          console.log('window.App1 available:', !!window.App1);
          if (window.App1) {
            console.log('✅ window.App1 found, setting appLoaded to true');
            setAppLoaded(true);
          } else {
            console.error('❌ window.App1 not found after loading all scripts');
          }
        });
    };

    loadLegacyApp().catch(err => console.error('❌ Failed to load legacy app:', err));
  }, []);

  // Render App1 if available
  if (window.App1 && appLoaded) {
    console.log('🎨 Rendering window.App1');
    return React.createElement(window.App1);
  }

  return <div style={{ width: '100%', height: '100vh', background: 'transparent' }} />;
}

export default App;
