import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Get Quote Flow', async ({ page }) => {
  test.setTimeout(90000);

  // 1. ไปที่หน้าหลัก
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });

  // 2. คลิกเลือกประกันมะเร็ง
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 3. FIX: แทนการเช็ค URL ให้เช็ค Heading Level 1 ที่ปรากฏในหน้าขอใบเสนอราคา
  // อ้างอิงจาก Snapshot: heading "เริ่มสร้างใบเสนอราคา กันเลย!" [level=1] [ref=e21]
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 4. เลื่อนลงมาที่หัวข้อคำถาม (Level 2)
  const genderSection = page.getByRole('heading', { name: 'กรุณาระบุเพศและสถานภาพสมรสของคุณ' });
  await genderSection.scrollIntoViewIfNeeded();

  // 5. คลิกเลือกเพศ "หญิงโสด"
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  // 6. ระบุวันเกิด (ระบุ Selector ให้แม่นยำขึ้นจาก Snapshot)
  // หาก snapshot ไม่มี textbox ชื่อ 'วันเกิด' ให้ลองใช้ locator ที่ระบุตำแหน่งได้แน่นอน
  // ในที่นี้สมมติว่าเป็น Input ที่ปรากฏขึ้นหลังเลือกเพศ
  const dobInput = page.locator('input[type="tel"], input[placeholder*="วันเกิด"]'); 
  
  await dobInput.click();
  // ใช้ .type เพื่อความปลอดภัยกับพวก input mask (เว้นวรรคอัตโนมัติ)
  await dobInput.pressSequentially('25081994', { delay: 100 }); 
  await dobInput.press('Enter');

  // 7. ถ่าย Screenshot ยืนยัน
  await page.screenshot({ path: 'test-results/cancer-quote-step1.png', fullPage: true });
});