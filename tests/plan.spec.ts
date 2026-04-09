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

// 6. ตอบคำถามสุขภาพ (ส่วนสูง/น้ำหนัก)
  if (await page.locator('#body-height').isVisible()) {
      await page.locator('#body-height').fill('164');
      await page.locator('#body-weight').fill('70');
      await page.getByRole('button', { name: 'ต่อไป' }).click();
  }

  // 6.1 เพิ่มเติม: ตอบคำถามเรื่องการสูบบุหรี่ (อ้างอิงจาก Snapshot ref=e78)
  const smokingQuestion = page.getByText('คุณสูบบุหรี่บ่อยแค่ไหน');
  if (await smokingQuestion.isVisible()) {
      // เลือก "ไม่สูบ" (ref=e79)
      await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }
      // 6.2 เพิ่มเติม: ตอบคำถามเรื่องประวัติครอบครัว (อ้างอิงจาก Snapshot ref=e84)
  const familyHistoryQuestion = page.getByText(/บิดา มารดา พี่ – น้อง/i);
  if (await familyHistoryQuestion.isVisible()) {
      // เลือก "ไม่เคย / ไม่มี" (ref=e93)
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }
      // 6.3 เพิ่มเติม: ตอบคำถามเรื่องประวัติการเจ็บป่วย (มะเร็ง/ตับอักเสบ/HIV) (ref=e95)
  const medicalHistoryQuestion = page.getByText(/ท่านเคยป่วย หรือได้รับการรักษาจากแพทย์ด้วยโรคต่อไปนี้/i);
  if (await medicalHistoryQuestion.isVisible()) {
      // เลือก "ไม่เคย / ไม่มี" (ref=e105)
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // 7. คลิก "ดูราคาของคุณ"
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  
  // ใช้ waitFor เพื่อรอให้ปุ่มปรากฏหลังจากตอบคำถามครบ
  await getQuoteBtn.waitFor({ state: 'visible', timeout: 15000 });
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