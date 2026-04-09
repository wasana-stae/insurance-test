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

  // 7. ระบุวันเกิด (ใช้ pressSequentially แทน fill เพื่อให้ระบบเว็บตรวจจับการพิมพ์ได้แม่นยำขึ้น)
  // ใส่ delay เล็กน้อยระหว่างตัวอักษรเพื่อจำลองการพิมพ์ของมนุษย์
  await page.locator('#dd-dob').pressSequentially('25', { delay: 100 });
  await page.locator('#mm-dob').pressSequentially('08', { delay: 100 });
  await page.locator('#yyyy-dob').pressSequentially('1994', { delay: 100 });

  // 8. คลิกปุ่ม "ต่อไป" หลังกรอกวันเกิดเสร็จ
  await page.getByRole('button', { name: 'ต่อไป' }).first().click();

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
  if (await page.getByText(/บิดา มารดา พี่ – น้อง/i).isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

  // 12. ตอบคำถามประวัติสุขภาพ (มะเร็ง/ตับอักเสบ/HIV)
  if (await page.getByText(/ท่านเคยป่วย หรือได้รับการรักษา/i).isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 13. ตอบคำถามการถือครองประกันมะเร็งจากที่อื่น
  if (await page.getByText(/ท่านมีหรือกำลังขอเอาประกันภัยโรคมะเร็ง/i).isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 14. ตอบคำถามเรื่องอาชีพและอุตสาหกรรม (ข้อสุดท้าย)
  if (await page.getByText(/คุณเป็นคนงาน หรือ แรงงาน ในอุตสาหกรรม/i).isVisible()) {
    await page.getByRole('button', { name: 'ไม่ใช่' }).click();
  }

  // 15. คลิกปุ่ม "ดูราคาของคุณ"
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  await getQuoteBtn.waitFor({ state: 'visible', timeout: 20000 });
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