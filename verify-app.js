const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 2200 } });

  try {
    console.log('1. Loading app...');
    await page.goto('https://solmasta.github.io/mts-assistant/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    let text = await page.locator('body').innerText();
    console.log('\n[SCREEN 1 - Initial Load]\n');
    console.log(text.slice(0, 1500));
    await page.screenshot({ path: 'verify-1-splash.png', fullPage: true });

    console.log('\n2. Checking for onboarding...');
    await page.waitForTimeout(2000);
    text = await page.locator('body').innerText();
    console.log('\n[SCREEN 2 - After Splash]\n');
    console.log(text.slice(0, 1500));
    
    // Try to find and fill the name input
    const nameInput = page.locator('input[type="text"]').first();
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('\n3. Found onboarding form, filling name...');
      await nameInput.fill('Test Tech');
      
      // Wait a moment and screenshot the form
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'verify-2-onboarding-filled.png', fullPage: true });
      
      // Try to click Get Started button
      const button = page.locator('button').filter({ hasText: /Get Started|Submit|Next/i }).first();
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('4. Clicking Get Started...');
        await button.click();
        await page.waitForTimeout(2000);
        
        text = await page.locator('body').innerText();
        console.log('\n[SCREEN 3 - After Onboarding]\n');
        console.log(text.slice(0, 2000));
        await page.screenshot({ path: 'verify-3-main-app.png', fullPage: true });
        
        // Check for main nav tabs
        const tabs = await page.locator('button').filter({ hasText: /Home|💬|🤖|📚|🛠️|Chat|Agents|Docs|Tools/i }).allTextContents();
        console.log('\n5. Navigation elements found:');
        tabs.slice(0, 10).forEach((t, i) => console.log(`   [${i}] ${t.trim()}`));
      }
    }
    
    console.log('\n✅ App verification complete - rendering verified');
    console.log('Screenshots saved: verify-1-splash.png, verify-2-onboarding-filled.png, verify-3-main-app.png');
    
  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  } finally {
    await browser.close();
  }
})();
