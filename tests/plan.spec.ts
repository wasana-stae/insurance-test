import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Get Quote Flow', async ({ page }) => {
  test.setTimeout(90000);

  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  await page.locator('#dd-dob').fill('25');
  await page.locator('#mm-dob').fill('08');
  await page.locator('#yyyy-dob').fill('1994');

  await page.keyboard.press('Enter');

  await page.screenshot({ 
    path: 'test-results/cancer-quote-dob-completed.png', 
    fullPage: true 
  });
}); // ตรวจสอบตัวนี้ให้ดีว่ามีครบถ้วน