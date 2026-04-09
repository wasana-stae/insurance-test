import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
//given go to roojai.com
  await page.goto('https://www.roojai.com/');
  await page.getByRole('button', { name: 'เช็คราคา' }).click();
  await page.getByRole('link', { name: 'Get quote travel insurance' }).click();
//when click on "เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง"
  await page.getByRole('button', { name: 'เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง' }).click();
  await page.getByRole('button', { name: 'เลือกจุดหมายปลายทาง' }).click();
//then select "China"
  await page.getByRole('button', { name: 'China' }).click();
  await page.getByRole('button', { name: 'ปิด' }).click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();
  await page.getByRole('img', { name: 'Single' }).click();
  await page.getByRole('radio', { name: '- 60 ปี' }).check();
  await page.getByRole('textbox', { name: 'เลือกช่วงวันที่' }).click();
  await page.getByLabel('เมษายน 12,').click();
  await page.getByLabel('เมษายน 30,').first().click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();
  await page.getByRole('button', { name: 'ดูราคาของคุณ' }).click();
// screenshot  await page.screenshot({ path: 'screenshot.png' });
await page.screenshot({ path: 'test-results/search-report.png', fullPage: true });
});