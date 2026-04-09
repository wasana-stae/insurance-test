import {test,expect} from '@playwright/test';

//given go to roojai
test('Roojai cancer Insurance - Plan Selection Flow', async ({ page }) => {
  // ตั้ง Timeout รวมของ Test นี้เป็น 60 วินาที เพื่อรองรับการโหลดหน้าแผนประกัน
  test.setTimeout(60000);
    await page.goto('https://www.roojai.com/', { waitUntil: 'domcontentloaded' });
    // คลิกปุ่มเช็คราคาและเลือกประกันโรคมะเร็ง
    await page.getByRole('button', { name: 'เช็คราคา' }).click();
    await page.getByRole('link', { name: 'Get quote cancer insurance' }).click();

    // เลือกแผนประกันโรคมะเร็งที่ต้องการ
    await page.getByRole('button', { name: 'แผนประกันโรคมะเร็ง' }).click();
    await page.getByRole('button', { name: 'แผน 1' }).click();
    await page.getByRole('button', { name: 'ต่อไป ↓' }).click();

    // ตรวจสอบว่าเข้าสู่หน้าคำนวณราคาแล้ว
    const calculateHeading = page.getByRole('heading', { name: 'นี่คือใบเสนอราคาของคุณ!' });
    await calculateHeading.waitFor({ state: 'visible', timeout: 20000 });

    // ตรวจสอบเพิ่มเติมว่าเห็นตัวเลขราคา (สัญลักษณ์ ฿) ปรากฏขึ้นจริง
    await expect(page.getByRole('heading', { name: /฿/ })).toBeVisible();

    // สุดท้ายถ่ายรูปหน้าจอและจบการทำงานทันที
    await page.screenshot({
      path: 'test-results/roojai-cancer-quote-success.png',
        fullPage: true
        });
        // หมายเหตุ: โค้ดจะปิด Browser และจบ Test ทันทีที่ถ่ายรูปเสร็จ ไม่มีการค้างไว้
    });