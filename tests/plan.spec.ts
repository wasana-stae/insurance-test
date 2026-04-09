import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Complete Quote Flow', async ({ page }) => {
  test.setTimeout(120000);

  // 1. ไปหน้าหลัก
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });

  // จัดการ Cookie Banner ทันที (ถ้ามี) เพื่อป้องกันการบังปุ่มอื่นๆ
  const cookieAcceptBtn = page.getByRole('button', { name: 'รับทราบ' });
  if (await cookieAcceptBtn.isVisible()) {
      await cookieAcceptBtn.click();
  }

  // 2. คลิกเลือกประกันมะเร็ง
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 3. เริ่มทำใบเสนอราคา (เลือกเพศ/วันเกิด)
  await page.getByRole('button', { name: 'หญิงโสด' }).click();
  await page.locator('#dd-dob').fill('25');
  await page.locator('#mm-dob').fill('08');
  await page.locator('#yyyy-dob').fill('1994');
  await page.getByRole('button', { name: 'ต่อไป' }).click();

  // 4. ตอบคำถามสุขภาพตามลำดับ
  if (await page.locator('#body-height').isVisible()) {
      await page.locator('#body-height').fill('164');
      await page.locator('#body-weight').fill('70');
      await page.getByRole('button', { name: 'ต่อไป' }).click();
  }

  // 5. ตอบคำถามพฤติกรรมและประวัติ (Smoking / Family / Medical)
  // ใช้ฟังก์ชันวนลูปคลิก "ไม่" สำหรับคำถามที่เหลือจนกว่าปุ่ม "ดูราคา" จะมา
  const negativeAnswers = page.getByRole('button', { name: /ไม่สูบ|ไม่เคย/i });
  
  // ตอบคำถาม Smoking
  if (await page.getByText('คุณสูบบุหรี่บ่อยแค่ไหน').isVisible()) {
      await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }
  
  // ตอบคำถามประวัติครอบครัว
  if (await page.getByText(/บิดา มารดา/).isVisible()) {
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

  // ตอบคำถามประวัติเจ็บป่วย
  if (await page.getByText(/ท่านเคยป่วย/).isVisible()) {
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 6. คลิก "ดูราคาของคุณ"
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  
  // เพิ่มการรอที่ยืดหยุ่นขึ้น
  await expect(getQuoteBtn).toBeVisible({ timeout: 20000 });
  await getQuoteBtn.click();

  // 7. ยืนยันหน้าสรุปราคาและถ่ายรูป
  await expect(page.getByRole('heading', { name: /ใบเสนอราคา|฿/i }).first()).toBeVisible({ timeout: 20000 });
  await page.screenshot({ path: 'test-results/cancer-quote-final.png', fullPage: true });
});