import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Complete Quote Flow', async ({ page }) => {
  // 1. ตั้ง Timeout 2 นาที เพราะหน้าคำนวณราคาอาจใช้เวลาประมวลผล
  test.setTimeout(120000);

  // 2. ไปที่หน้าหลัก Roojai
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });

  // 3. จัดการ Cookie Banner (ปุ่ม "รับทราบ") เพื่อไม่ให้บังปุ่มอื่น
  const cookieAcceptBtn = page.getByRole('button', { name: 'รับทราบ' });
  if (await cookieAcceptBtn.isVisible()) {
    await cookieAcceptBtn.click();
  }

  // 4. คลิกเลือก "ประกันมะเร็ง"
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 5. ยืนยันว่าเข้าสู่หน้าทำรายการ (Heading: เริ่มสร้างใบเสนอราคา กันเลย!)
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 6. ระบุเพศและสถานภาพ: หญิงโสด
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  // 7. ระบุวันเกิด: 25/08/1994
  await page.locator('#dd-dob').fill('25');
  await page.locator('#mm-dob').fill('08');
  await page.locator('#yyyy-dob').fill('1994');
  await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

  // 8. ตอบคำถามสุขภาพ (ส่วนสูง/น้ำหนัก)
  if (await page.locator('#body-height').isVisible()) {
    await page.locator('#body-height').fill('164');
    await page.locator('#body-weight').fill('70');
    await page.getByRole('button', { name: 'ต่อไป ↓' }).click();
  }

  // 9. ตอบคำถามพฤติกรรม: การสูบบุหรี่
  const smokingQuestion = page.getByText('คุณสูบบุหรี่บ่อยแค่ไหน');
  if (await smokingQuestion.isVisible()) {
    await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }

  // 10. ตอบคำถามประวัติครอบครัว (มะเร็งในสายเลือด)
  const familyHistory = page.getByText(/บิดา มารดา พี่ – น้อง/i);
  if (await familyHistory.isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

  // 11. ตอบคำถามประวัติสุขภาพ (มะเร็ง/ตับอักเสบ/HIV)
  const medicalHistory = page.getByText(/ท่านเคยป่วย หรือได้รับการรักษา/i);
  if (await medicalHistory.isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 12. ตอบคำถามการถือครองประกันมะเร็งจากที่อื่น
  const existingInsurance = page.getByText(/ท่านมีหรือกำลังขอเอาประกันภัยโรคมะเร็ง/i);
  if (await existingInsurance.isVisible()) {
    await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 13. ตอบคำถามเรื่องอาชีพและอุตสาหกรรม (ข้อสุดท้าย)
  const industryQuestion = page.getByText(/คุณเป็นคนงาน หรือ แรงงาน ในอุตสาหกรรม/i);
  if (await industryQuestion.isVisible()) {
    await page.getByRole('button', { name: 'ไม่ใช่' }).click();
  }

  // 14. คลิกปุ่ม "ดูราคาของคุณ"
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  await expect(getQuoteBtn).toBeVisible({ timeout: 20000 });
  await getQuoteBtn.click();

  // 15. ตรวจสอบหน้าสรุปราคา และถ่าย Screenshot
  // รอให้เจอหัวข้อใบเสนอราคา หรือสัญลักษณ์ราคา (฿)
  await expect(page.getByRole('heading', { name: /ใบเสนอราคา|฿/i }).first()).toBeVisible({ timeout: 30000 });
  
  await page.screenshot({ 
    path: 'test-results/cancer-insurance-final-quote.png', 
    fullPage: true 
  });

  console.log('Success: All questions answered and quote generated.');
});