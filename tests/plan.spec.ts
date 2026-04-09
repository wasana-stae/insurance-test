import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Get Quote Flow', async ({ page }) => {
  // ตั้ง Timeout รวมสำหรับกระบวนการขอใบเสนอราคา
  test.setTimeout(90000);

  // 1. given ไปที่หน้าหลัก
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });

  // 2. เจอแบนเนอร์ คลิกเลือกประกันมะเร็ง
  // โดยปกติปุ่มบนแบนเนอร์หรือเมนูมักจะใช้คำว่า "ประกันมะเร็ง"
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 3. when เมื่อเข้ามาที่หน้าขอใบเสนอราคาแล้ว
  // รอให้หน้าโหลดจนปุ่ม "เช็คราคา" หรือ Element หลักปรากฏ
  await expect(page).toHaveURL(/.*cancer-insurance/);

  // 4. เลื่อนลงมาที่ section "กรุณาระบุเพศและสถานภาพสมรสของคุณ ?"
  // Playwright จะเลื่อนให้อัตโนมัติเมื่อเราสั่ง interaction แต่เราสามารถสั่ง scroll ได้ถ้าต้องการ
  const genderSection = page.getByText('กรุณาระบุเพศและสถานภาพสมรสของคุณ');
  await genderSection.scrollIntoViewIfNeeded();

  // 5. then คลิกเลือกเพศ "หญิงโสด"
  // ใช้ getByRole('button') หรือ getByText ตามโครงสร้างจริงของหน้าเว็บ
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  // 6. ระบุวันเกิด "25081994"
  // โดยปกติช่องวันเกิดมักจะเป็น textbox หรือใส่ทีละส่วน
  const dobInput = page.getByRole('textbox', { name: /วันเกิด|วว\/ดด\/ปปปป/i });
  
  // คลิกและพิมพ์วันเกิด
  await dobInput.click();
  await dobInput.fill('25081994');
  
  // กด Enter หรือคลิกพื้นที่ว่างเพื่อให้ระบบบันทึกค่า
  await dobInput.press('Enter');

  // ตรวจสอบความถูกต้องเบื้องต้นก่อนจบ
  await expect(dobInput).toHaveValue(/25.*08.*1994/);

  // ถ่าย Screenshot ยืนยันการกรอกข้อมูล
  await page.screenshot({ path: 'test-results/cancer-quote-step1.png', fullPage: true });
});