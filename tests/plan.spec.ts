import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Complete Quote Flow', async ({ page }) => {
  // 1. ตั้ง Timeout 2 นาที เผื่อหน้าเว็บโหลดช้า
  test.setTimeout(120000);

  // 2. ไปที่หน้าหลัก และรอให้ Network นิ่งก่อนเริ่มทำงาน
  await page.goto('https://www.roojai.com/', { waitUntil: 'networkidle' });

  // 3. จัดการปุ่ม "รับทราบ" (Cookie) ทันทีเพื่อไม่ให้บังส่วนอื่นของหน้าจอ
  const cookieBtn = page.getByRole('button', { name: 'รับทราบ' });
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
  }

  // 4. คลิกเลือก "ประกันมะเร็ง"
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 5. ยืนยันว่าเข้าสู่หน้าแบบฟอร์มแล้ว
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 6. คลิกเลือกเพศ: หญิงโสด
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

 // 7. ระบุวันเกิด - แก้ไขโดยการเน้นการ Focus และตรวจสอบความพร้อมของปุ่ม
  const dayInput = page.locator('#dd-dob');
  const monthInput = page.locator('#mm-dob');
  const yearInput = page.locator('#yyyy-dob');
  const nextBtn = page.getByRole('button', { name: 'ต่อไป' }).first();

  // ล้างข้อมูลเก่าและพิมพ์ใหม่ให้มั่นใจ
  await dayInput.click();
  await dayInput.fill('25');
  
  await monthInput.click();
  await monthInput.fill('08');
  
  await yearInput.click();
  await yearInput.fill('1994');

  // ตรวจสอบว่าปุ่ม "ต่อไป" ต้องหายจากสถานะ disabled ก่อนคลิก
  // Playwright จะรอให้อัตโนมัติด้วยคำสั่งคลิก แต่การเช็ค enabled จะช่วยลดปัญหา Flaky เทส
  await expect(nextBtn).toBeEnabled({ timeout: 10000 });
  await nextBtn.click();

  // 9. ตอบคำถามสุขภาพ (ส่วนสูง/น้ำหนัก)
  if (await page.locator('#body-height').isVisible()) {
    await page.locator('#body-height').fill('164');
    await page.locator('#body-weight').fill('70');
    await page.getByRole('button', { name: 'ต่อไป' }).first().click();
  }

  // 10. ตอบคำถามพฤติกรรม: การสูบบุหรี่
  if (await page.getByText('คุณสูบบุหรี่บ่อยแค่ไหน').isVisible()) {
    await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }

  // 11. ตอบคำถามประวัติครอบครัว
  const famQ = page.getByText(/บิดา มารดา พี่ – น้อง/i);
  await famQ.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  if (await famQ.isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

// 12. ตอบคำถามประวัติสุขภาพ (มะเร็ง/ตับอักเสบ/HIV) - **ต้องรอให้เจอหัวข้อก่อน**
  const medQ = page.getByText(/ท่านเคยป่วย หรือได้รับการรักษาจากแพทย์ด้วยโรคต่อไปนี้/i);
  await expect(medQ).toBeVisible({ timeout: 10000 }); // รอจนกว่าคำถามจะขึ้น
  await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();

  // 13. ตอบคำถามการถือครองประกันมะเร็งจากที่อื่น (ถ้ามี)
  const insQ = page.getByText(/ท่านมีหรือกำลังขอเอาประกันภัยโรคมะเร็ง/i);
  if (await insQ.isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 14. ตอบคำถามเรื่องอาชีพและอุตสาหกรรม (ถ้ามี)
  const indQ = page.getByText(/คุณเป็นคนงาน หรือ แรงงาน/i);
  if (await indQ.isVisible({ timeout: 5000 })) {
    await page.getByRole('button', { name: 'ไม่ใช่' }).click();
  }

  // 15. คลิกปุ่ม "ดูราคาของคุณ"
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  // รอให้ปุ่ม Enabled และพร้อมคลิก
  await getQuoteBtn.waitFor({ state: 'visible', timeout: 15000 });
  await getQuoteBtn.click();

  // 16. ตรวจสอบหน้าสรุปราคา และถ่าย Screenshot
  // รอจนกว่าจะเห็นสัญลักษณ์ราคา (฿) หรือคำว่า "ใบเสนอราคา"
  await expect(page.getByText(/ใบเสนอราคา|฿/i).first()).toBeVisible({ timeout: 30000 });
  
  await page.screenshot({ 
    path: 'test-results/cancer-insurance-final-quote.png', 
    fullPage: true 
  });

  console.log('Success: All steps completed!');
});