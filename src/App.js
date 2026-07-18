import React from 'react';

function App() {
  const [appLoaded, setAppLoaded] = React.useState(false);

  // Load legacy app modules
  React.useEffect(() => {
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
      .then(() => loadScript(`${publicUrl}/app3.js`))
      .then(() => {
        // Check if App1 is available
        if (window.App1) {
          setAppLoaded(true);
        }
      });

    loadLegacyApp().catch(err => console.error('Failed to load legacy app:', err));
  }, []);

  // Render App1 if available
  if (window.App1 && appLoaded) {
    return React.createElement(window.App1);
  }

  return <div style={{ width: '100%', height: '100vh', background: 'transparent' }} />;
}

export default App;
