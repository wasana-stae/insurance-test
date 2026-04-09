import { test, expect } from '@playwright/test';

test('Roojai Travel Insurance - Get Quote Flow', async ({ page }) => {
  // ตั้ง Timeout รวมของ Test นี้เป็น 60 วินาที เพื่อรองรับการโหลดหน้าประเมินราคา
  test.setTimeout(60000);

  // 1. Given: เข้าหน้าเว็บไซต์ Roojai
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });
  
  // คลิกปุ่มเช็คราคาและเลือกประกันเดินทาง
  await page.getByRole('button', { name: 'เช็คราคา' }).click();
  await page.getByRole('link', { name: 'Get quote travel insurance' }).click();

  // 2. When: เลือกประเภทการเดินทางและจุดหมาย (จีน)
  await page.getByRole('button', { name: 'เดินทางต่างประเทศ ท่องเที่ยวออกสู่โลกกว้าง' }).click();
  await page.getByRole('button', { name: 'เลือกจุดหมายปลายทาง' }).click();
  await page.getByRole('button', { name: 'China' }).click();
  await page.getByRole('button', { name: 'ปิด' }).click();
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // 3. ข้อมูลผู้เดินทางและช่วงวันที่
  await page.getByRole('img', { name: 'Single' }).click();
  await page.getByRole('radio', { name: '- 60 ปี' }).check();
  
  // คลิกเพื่อเปิดปฏิทินและเลือกวันที่
  await page.getByRole('textbox', { name: 'เลือกช่วงวันที่' }).click();
  await page.getByLabel('เมษายน 12,').click();
  await page.getByLabel('เมษายน 30,').first().click();
  
  // กดต่อไปเพื่อเข้าสู่หน้าคำนวณ
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // 4. Action: คลิกเพื่อดูราคาประเมิน
  await page.getByRole('button', { name: 'ดูราคาของคุณ' }).click();

  // 5. Then: ยืนยันว่ามาถึงหน้าใบเสนอราคาแล้ว
  // ใช้ getByRole('heading') เพื่อรอข้อความยืนยันจากระบบ
  const quoteHeading = page.getByRole('heading', { name: 'นี่คือใบเสนอราคาของคุณ!' });
  await quoteHeading.waitFor({ state: 'visible', timeout: 20000 });

  // ตรวจสอบเพิ่มเติมว่าเห็นตัวเลขราคา (สัญลักษณ์ ฿) ปรากฏขึ้นจริง
  await expect(page.getByRole('heading', { name: /฿/ })).toBeVisible();

  // 6. Final: Screenshot และจบการทำงานทันที
  await page.screenshot({ 
    path: 'test-results/roojai-quote-success.png', 
    fullPage: true 
  });

  // หมายเหตุ: โค้ดจะปิด Browser และจบ Test ทันทีที่ถ่ายรูปเสร็จ ไม่มีการค้างไว้
});