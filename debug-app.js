const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Capture console logs
  page.on('console', msg => {
    console.log(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', err => {
    console.log(`[ERROR] ${err.message}`);
  });
  
  console.log('🌐 Navigating to app...');
  await page.goto('https://solmasta.github.io/mts-assistant/', { waitUntil: 'networkidle' });
  
  // Wait for any async operations
  await new Promise(r => setTimeout(r, 5000));
  
  // Check window state
  const windowState = await page.evaluate(() => {
    return {
      appLoaded: typeof window.App1,
      reactLoaded: typeof window.React,
      app1Methods: window.App1 ? Object.keys(window.App1).slice(0, 5) : 'N/A',
      bodyChildren: document.body.children.length,
      rootElement: !!document.getElementById('root'),
      rootContent: document.getElementById('root')?.innerHTML.slice(0, 100)
    };
  });
  
  console.log('\n📊 Window State:');
  console.log(JSON.stringify(windowState, null, 2));
  
  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('\n✅ Screenshot saved to debug-screenshot.png');
  
  await browser.close();
})().catch(console.error);
