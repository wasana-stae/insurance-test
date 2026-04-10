import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Complete Quote Flow to Result Page', async ({ page }) => {
  // 1. ตั้ง Timeout สูงสุด 2 นาที เพื่อรองรับการคำนวณเบี้ยประกันที่ใช้เวลา
  test.setTimeout(120000);

  // 2. เข้าสู่เว็บไซต์
  await page.goto('https://www.roojai.com/', { waitUntil: 'networkidle' });

  // 3. จัดการ Cookie Banner (รอบแรก)
  const cookieBtn = page.getByRole('button', { name: 'รับทราบ' });
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
  }

  // 4. ไปหน้าประกันมะเร็ง
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 5. เลือกเพศและกรอกวันเกิด
  await page.getByRole('button', { name: 'หญิงโสด' }).click();
  await page.locator('#dd-dob').fill('25');
  await page.locator('#mm-dob').fill('08');
  await page.locator('#yyyy-dob').fill('1994');
  await page.getByRole('button', { name: 'ต่อไป' }).first().click();

  // 6. ส่วนสูงและน้ำหนัก
  if (await page.locator('#body-height').isVisible()) {
    await page.locator('#body-height').fill('164');
    await page.locator('#body-weight').fill('50');
    await page.getByRole('button', { name: 'ต่อไป' }).first().click();
  }

  // 7. ตอบคำถามสุขภาพ (แบบ Dynamic)
  // สูบบุหรี่
  if (await page.getByText(/สูบบุหรี่/i).isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }

  // ประวัติครอบครัว
  if (await page.getByText(/บิดา มารดา/i).isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

  // ประวัติสุขภาพร้ายแรง (ใช้ Regex ยืดหยุ่นแก้ปัญหาเว้นวรรค)
  if (await page.getByText(/ท่านเคยป่วย.*โรคต่อไปนี้/i).isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // ประกันมะเร็งที่อื่น
  if (await page.getByText(/ท่านมีหรือกำลังขอเอาประกันภัย/i).isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // อาชีพ/อุตสาหกรรม
  if (await page.getByText(/คุณเป็นคนงาน หรือ แรงงาน/i).isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่ใช่' }).click();
  }

  // 8. คลิกปุ่ม "ดูราคาเลย"
  const getQuoteBtn = page.getByRole('button', { name: /ดูราคาเลย/i });
  await getQuoteBtn.waitFor({ state: 'visible', timeout: 15000 });
  await getQuoteBtn.click();

  // 9. รอหน้าสรุปราคาโหลด (ใช้ Network Idle เพื่อให้ Spinner หายไป)
  await page.waitForLoadState('networkidle', { timeout: 60000 });

  // 10. ยืนยันหน้าสรุปราคาโดยใช้ "เลขที่ใบเสนอราคา" หรือ "ประกันของคุณ" (Stable Locator)
  const summaryHeader = page.getByText(/ใบเสนอราคาเลขที่|ประกันของคุณ/i).first();
  await expect(summaryHeader).toBeVisible({ timeout: 45000 });

  // 11. ตรวจสอบและปิด Cookie อีกรอบถ้ามันเด้งขึ้นมาบังราคา
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
  }

  // 12. ถ่าย Screenshot ผลลัพธ์สุดท้าย
  await page.screenshot({ 
    path: `test-results/quote-result-${Date.now()}.png`, 
    fullPage: true 
  });

  console.log('✅ ภารกิจสำเร็จ: แสดงหน้าเบี้ยประกันและบันทึกภาพเรียบร้อย!');
});