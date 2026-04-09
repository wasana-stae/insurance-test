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
  
  // (โค้ดเดิมของคุณ: ตอบ Smoking)
  if (await page.getByText('คุณสูบบุหรี่บ่อยแค่ไหน').isVisible()) {
      await page.getByRole('button', { name: 'ไม่สูบ' }).click();
  }
  
  // (โค้ดเดิมของคุณ: ตอบประวัติครอบครัว)
  if (await page.getByText(/บิดา มารดา/).isVisible()) {
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).click();
  }

  // (โค้ดเดิมของคุณ: ตอบประวัติเจ็บป่วย)
  if (await page.getByText(/ท่านเคยป่วย/).isVisible()) {
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }

  // --- เพิ่มส่วนนี้เข้าไป (คำถามข้อสุดท้ายที่เพิ่งโผล่มา) ---
  const existingInsurance = page.getByText(/ท่านมีหรือกำลังขอเอาประกันภัยโรคมะเร็ง/i);
  if (await existingInsurance.isVisible()) {
      // คลิก "ไม่เคย / ไม่มี" ตัวล่าสุดที่ปรากฏขึ้นมา
      await page.getByRole('button', { name: 'ไม่เคย / ไม่มี' }).last().click();
  }
  // --------------------------------------------------

  // 6. คลิก "ดูราคาของคุณ" (ตอนนี้ปุ่มควรจะมาแล้ว)
  const getQuoteBtn = page.getByRole('button', { name: 'ดูราคาของคุณ' });
  await expect(getQuoteBtn).toBeVisible({ timeout: 20000 });
  await getQuoteBtn.click();
});