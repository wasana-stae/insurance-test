import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // เพิ่ม Timeout รวมของ Test นี้เป็น 2 นาที (เพราะหน้าประเมินราคาอาจโหลดช้า)
  test.setTimeout(120000);

  // given go to roojai.com
  await page.goto('https://www.roojai.com/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'เช็คราคา' }).click();
  await page.getByRole('link', { name: 'Get quote travel insurance' }).click();

  // when click on "เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง"
  await page.getByRole('button', { name: 'เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง' }).click();
  await page.getByRole('button', { name: 'เลือกจุดหมายปลายทาง' }).click();

  // then select "China"
  await page.getByRole('button', { name: 'China' }).click();
  await page.getByRole('button', { name: 'ปิด' }).click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();
  await page.getByRole('img', { name: 'Single' }).click();
  await page.getByRole('radio', { name: '- 60 ปี' }).check();
  await page.getByRole('textbox', { name: 'เลือกช่วงวันที่' }).click();
  
  // เลือกวันที่
  await page.getByLabel('เมษายน 12,').click();
  await page.getByLabel('เมษายน 30,').first().click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // เพิ่ม Timeout เฉพาะจุดนี้เป็น 30 วินาที เพื่อรอหน้าประเมินราคาโหลด
  await page.getByRole('button', { name: 'ดูราคาของคุณ' }).click();

  // รันให้มั่นใจว่าหน้าประเมินราคาโหลดเสร็จ (รอให้ Element บางอย่างในหน้านั้นปรากฏ)
  // สมมติว่าหน้าประเมินราคามีข้อความว่า "แผนประกันของคุณ"
  // await expect(page.getByText('แผนประกันของคุณ')).toBeVisible({ timeout: 30000 });

  // Screenshot หน้าประเมินราคา
  await page.screenshot({ path: 'test-results/search-report.png', fullPage: true });

  // --- ส่วนที่เพิ่มเพื่อให้เราดูหน้าจอทัน ---
  // รอ 10 วินาทีให้เราดูหน้าจอประเมินราคาก่อนปิด Browser (เฉพาะตอนรันแบบ Headed)
  await page.waitForTimeout(10000); 
});