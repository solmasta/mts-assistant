const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH,
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  await page.goto('https://solmasta.github.io/mts-assistant/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'tmp/live-onboarding.png', fullPage: true });

  const nameInput = page.getByPlaceholder(/name/i).or(page.getByLabel(/name/i));
  await nameInput.fill('Copilot Test');

  const regionSelect = page.locator('select').first();
  await regionSelect.selectOption({ index: 1 });

  const getStarted = page.getByRole('button', { name: /get started/i });
  await getStarted.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  await page.screenshot({ path: 'tmp/live-home.png', fullPage: true });

  const navButtons = await page.getByRole('button').all();
  for (const button of navButtons) {
    const text = (await button.innerText()).trim();
    if (!text) {
      continue;
    }

    const normalized = text.toLowerCase();
    if (normalized.includes('chat')) {
      await button.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tmp/live-chat.png', fullPage: true });
    }

    if (normalized.includes('docs')) {
      await button.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tmp/live-docs.png', fullPage: true });
    }

    if (normalized.includes('tools')) {
      await button.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tmp/live-tools.png', fullPage: true });
    }

    if (normalized.includes('agents')) {
      await button.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'tmp/live-agents.png', fullPage: true });
    }
  }

  console.log('BODY_TEXT_START');
  console.log((await page.locator('body').innerText()).slice(0, 8000));
  console.log('BODY_TEXT_END');

  await browser.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});