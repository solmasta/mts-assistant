import React from 'react';

function App() {
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
      .then(() => loadScript(`${publicUrl}/app3.js`));

    loadLegacyApp().catch(err => console.error('Failed to load legacy app:', err));
  }, []);

  return <div id="app-container" style={{ width: '100%', height: '100%', minHeight: '100vh' }} />;
}

export default App;
