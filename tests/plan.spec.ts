import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Complete Quote Flow', async ({ page }) => {
  // ตั้ง Timeout 2 นาที สำหรับการโหลดหน้าคำนวณราคาที่อาจจะช้า
  test.setTimeout(120000);

  // 1. ไปหน้าหลักและเลือกประกันมะเร็ง
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 2. ตรวจสอบว่าเข้าสู่หน้าขอใบเสนอราคาสำเร็จ
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 3. ระบุเพศและสถานภาพ
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  // 4. ระบุวันเกิด (แก้ปัญหา Strict Mode โดยระบุ ID เฉพาะ)
  await page.locator('#dd-dob').fill('25');
  await page.locator('#mm-dob').fill('08');
  await page.locator('#yyyy-dob').fill('1994');

  // 5. คลิกปุ่ม "ต่อไป" หรือกด Enter
  // หมายเหตุ: บางครั้งปุ่มต่อไปจะเปิดให้กดหลังจากกรอก DOB ครบ
  const nextButton = page.getByRole('button', { name: 'ต่อไป' });
  await nextButton.click();

  // 6. ตอบคำถามสุขภาพ (ตัวอย่าง: ส่วนสูง/น้ำหนัก หรือคำถาม "ใช่/ไม่ใช่")
  // Playwright จะกรอกข้อมูลที่ระบบถามต่อจนถึงหน้าดูราคา
  // ในที่นี้สมมติว่าต้องใส่ส่วนสูงและน้ำหนักตาม Snapshot ก่อนหน้า
  if (await page.locator('#body-height').isVisible()) {
      await page.locator('#body-height').fill('160');
      await page.locator('#body-weight').fill('50');
      await page.getByRole('button', { name: 'ต่อไป' }).click();
  }

  // 7. คลิก "ดูราคาของคุณ"
  // ปุ่มนี้จะปรากฏหลังจากตอบคำถามครบทุกข้อ
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  await expect(getQuoteBtn).toBeVisible({ timeout: 15000 });
  await getQuoteBtn.click();

  // 8. ตรวจสอบหน้าสรุปราคา (หน้าสุดท้าย)
  // รอให้เจอหัวข้อ "นี่คือใบเสนอราคาของคุณ!" หรือ "แผนที่แนะนำ"
  await expect(page.getByText(/ใบเสนอราคา|แผนประกัน/i).first()).toBeVisible({ timeout: 20000 });

  // 9. ถ่าย Screenshot ผลลัพธ์สุดท้ายที่คำนวณราคาเสร็จแล้ว
  await page.screenshot({ 
    path: 'test-results/cancer-insurance-final-quote.png', 
    fullPage: true 
  });

  console.log('Flow completed: Cancer insurance quote generated successfully.');
});