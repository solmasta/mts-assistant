import React from 'react';
import ReactDOM from 'react-dom/client';

// Nothing in the app tree (public/app1-3.js, ~7000 lines of legacy React
// components with no error boundaries of their own) catches render errors,
// so any unhandled exception would otherwise crash to a blank white/black
// screen with no way back short of knowing to manually reload.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('❌ Unhandled error in app tree:', error, info);
    // The splash screen only gets hidden by app-specific init timing —
    // if the crash happens before that runs, the splash (fixed on top of
    // #root) would otherwise hide this fallback from the user forever.
    const splash = document.getElementById('splash');
    if (splash) splash.remove();
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          width: '100%', height: '100vh', minHeight: '100vh', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: 30, textAlign: 'center', background: '#0a0a0a', color: '#fff',
          fontFamily: 'sans-serif',
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#E30613', marginBottom: 8 }}>
            Something went wrong
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 20, maxWidth: 320, wordBreak: 'break-word' }}>
            {this.state.error.message || 'The app hit an unexpected error.'}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#E30613', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
          console.log('✅ All scripts loaded. Checking for window.App3...');
          console.log('window.App3 available:', !!window.App3);
          if (window.App3) {
            console.log('✅ window.App3 found, setting appLoaded to true');
            setAppLoaded(true);
          } else {
            console.error('❌ window.App3 not found after loading all scripts');
          }
        });
    };

    loadLegacyApp().catch(err => console.error('❌ Failed to load legacy app:', err));
  }, []);

  // Render App3 if available
  if (window.App3 && appLoaded) {
    console.log('🎨 Rendering window.App3');
    return (
      <ErrorBoundary>
        {React.createElement(window.App3)}
      </ErrorBoundary>
    );
  }

  return <div style={{ width: '100%', height: '100vh', background: 'transparent' }} />;
}

export default App;
