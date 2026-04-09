import { test, expect } from '@playwright/test';

test('Roojai Cancer Insurance - Get Quote Flow', async ({ page }) => {
  // ตั้ง Timeout รวมสำหรับกระบวนการทั้งหมด
  test.setTimeout(90000);

  // 1. ไปที่หน้าหลัก
  await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });

  // 2. คลิกเลือกประกันมะเร็ง (ใช้ getByRole เพื่อความเสถียร)
  await page.getByRole('link', { name: 'ประกันมะเร็ง', exact: false }).first().click();

  // 3. ยืนยันว่ามาถึงหน้าขอใบเสนอราคาแล้ว โดยเช็คจากหัวข้อหลัก
  await expect(page.getByRole('heading', { name: 'เริ่มสร้างใบเสนอราคา กันเลย!' })).toBeVisible({ timeout: 15000 });

  // 4. คลิกเลือกเพศและสถานภาพ "หญิงโสด"
  // Playwright จะ scroll ไปที่ปุ่มให้อัตโนมัติก่อนคลิก
  await page.getByRole('button', { name: 'หญิงโสด' }).click();

  // 5. ระบุวันเกิด "25/08/1994"
  // แก้ไขปัญหา Strict Mode โดยระบุ ID เฉพาะของแต่ละช่อง (dd, mm, yyyy)
  
  // กรอกวันที่
  const dayInput = page.locator('#dd-dob');
  await dayInput.fill('25');
  
  // กรอกเดือน
  const monthInput = page.locator('#mm-dob');
  await monthInput.fill('08');
  
  // กรอกปี (พ.ศ. หรือ ค.ศ. ตามที่หน้าเว็บระบุ ในที่นี้ใช้ 1994 ตามโจทย์)
  const yearInput = page.locator('#yyyy-dob');
  await yearInput.fill('1994');

  // 6. กด Enter หรือคลิกปุ่มต่อไปเพื่อบันทึกข้อมูล
  await page.keyboard.press('Enter');

  // 7. ตรวจสอบว่าปุ่ม "ต่อไป" เปิดใช้งานแล้ว (ถ้ามี) หรือถ่ายรูปผลลัพธ์
  await page.screenshot({ 
    path: 'test-results/cancer-quote-dob-completed.png', 
    fullPage: true 
  });