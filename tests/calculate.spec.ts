import { test, expect } from '@playwright/test';

test('Roojai Travel Insurance - Get Quote Flow', async ({ page }) => {
  // ตั้ง Timeout รวมของ Test นี้ (ป้องกันกรณีหน้าเว็บค้าง)
  test.setTimeout(60000);

  // 1. Given: เข้าหน้าเว็บ Roojai
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'เช็คราคา' }).click();
  await page.getByRole('link', { name: 'Get quote travel insurance' }).click();

  // 2. When: เลือกประเภทการเดินทางและจุดหมาย
  await page.getByRole('button', { name: 'เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง' }).click();
  await page.getByRole('button', { name: 'เลือกจุดหมายปลายทาง' }).click();
  await page.getByRole('button', { name: 'China' }).click();
  await page.getByRole('button', { name: 'ปิด' }).click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // 3. ข้อมูลผู้เดินทางและวันที่
  await page.getByRole('img', { name: 'Single' }).click();
  await page.getByRole('radio', { name: '- 60 ปี' }).check();
  await page.getByRole('textbox', { name: 'เลือกช่วงวันที่' }).click();
  
  // เลือกวันที่ (ระบุวันที่ให้ชัดเจน)
  await page.getByLabel('เมษายน 12,').click();
  await page.getByLabel('เมษายน 30,').first().click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // 4. Click เพื่อดูราคาประเมิน
  await page.getByRole('button', { name: 'ดูราคาของคุณ' }).click();

  // 5. Then: รอให้หน้าประเมินราคาโหลดเสร็จ (ตรวจสอบจากหัวข้อหรือปุ่มซื้อ)
  // ใช้การรอ Element แทนการรอเวลา เพื่อให้ Test จบได้ทันทีที่หน้าเว็บพร้อม
  const priceDisplay = page.locator('.price-display, #quote-result-container').first(); 
  await priceDisplay.waitFor({ state: 'visible', timeout: 20000 });

  // 6. Screenshot และจบการทำงานทันที
  await page.screenshot({ 
    path: 'test-results/quote-report.png', 
    fullPage: true 
  });

  // จบ Flow ตรงนี้ ไม่มีการรอต่อ (Test จะ Complete และปิด Browser ทันที)
});