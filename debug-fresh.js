const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Disable JavaScript caching
  await page.context().addInitScript(() => {
    // Clear service workers
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(r => r.unregister());
      });
    }
  });
  
  // Capture console logs
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[ERROR] ${err.message}`);
  });
  
  console.log('🌐 Navigating to app...');
  await page.goto('https://solmasta.github.io/mts-assistant/', { 
    waitUntil: 'networkidle'
  });
  
  // Wait for any async operations
  await new Promise(r => setTimeout(r, 5000));
  
  // Check window state
  const windowState = await page.evaluate(() => {
    return {
      appLoaded: typeof window.App1,
      reactLoaded: typeof window.React,
      appExists: !!window.App1,
      bodyReady: !!document.body,
      rootContent: document.getElementById('root')?.innerHTML?.slice(0, 200)
    };
  });
  
  console.log('\n📊 Final State:');
  console.log(JSON.stringify(windowState, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: 'debug-fresh.png', fullPage: true });
  console.log('\n✅ Screenshot saved to debug-fresh.png');
  
  await browser.close();
})().catch(console.error);
