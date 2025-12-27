
import { test, expect } from '@playwright/test';

test('Repro: Document Title Persists After Move', async ({ page }) => {
    // 1. 登录
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@123.com');
    await page.fill('input[type="password"]', '1234567');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. 进入知识库
    const firstTeamLink = page.locator('a[href^="/teams/"]').first();
    await firstTeamLink.click();
    await page.waitForURL(/\/teams\/[^/]+$/);
    const kbCard = page.locator('.bg-white.rounded-xl.border').first();
    await kbCard.click();
    await page.waitForURL(/\/teams\/[^/]+\/kb\/[^/]+/);

    // 3. Create Doc First (to ensure editor loads cleanly)
    await page.click('button:has-text("新建")');
    await page.locator('button:has-text("文档")').click();
    await expect(page).toHaveURL(/doc=/);

    // 4. 重命名文档
    const testTitle = 'Moving Doc ' + Date.now();
    const titleInput = page.getByTestId('doc-title-input');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await titleInput.fill(testTitle);
    await titleInput.blur();

    // Wait for sidebar update
    await expect(page.locator('aside').getByText(testTitle).first()).toBeVisible();

    // 5. Back to KB Root
    await page.locator('header .cursor-pointer').first().click();
    await expect(page).not.toHaveURL(/doc=/);

    // 6. Create Target Folder NOW
    const folderName = 'Target Folder ' + Date.now();
    page.on('dialog', async dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept(folderName);
    });

    const directoryHeader = page.getByText('目录').first();
    await directoryHeader.hover();
    await page.locator('button[title="新建文件夹"]').click();

    // Verify folder created
    await expect(page.locator('aside').getByText(folderName)).toBeVisible();

    // 7. Perform Drag and Drop
    const docItem = page.locator('aside').getByText(testTitle).first();
    const folderItem = page.locator('aside').getByText(folderName).first();

    await docItem.dragTo(folderItem);

    // 8. Verify Result
    await page.waitForTimeout(2000);

    // Check if title is still 'Moving Doc ...'
    // Expand folder (click it)
    await folderItem.click();
    await page.waitForTimeout(500);

    const movedDoc = page.locator('aside').getByText(testTitle).first();
    await expect(movedDoc).toBeVisible({ timeout: 5000 });
});
