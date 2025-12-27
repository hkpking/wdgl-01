
import { test, expect } from '@playwright/test';

test('Repro: Sidebar Inline Rename', async ({ page }) => {
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

    // 3. 创建测试文档
    await page.click('button:has-text("新建")');
    await page.locator('button:has-text("文档")').click();
    await expect(page).toHaveURL(/doc=/);

    // Set initial title with robust wait
    const initialTitle = 'Rename Test Doc ' + Date.now();
    const titleInput = page.getByTestId('doc-title-input');

    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await titleInput.fill(initialTitle);
    await titleInput.blur();

    // Wait for sidebar update
    await expect(page.locator('aside').getByText(initialTitle).first()).toBeVisible();

    // 4. Trigger Rename via Context Menu (Right Click) in Sidebar
    const docItem = page.locator('aside').getByText(initialTitle).first();
    await docItem.click({ button: 'right' });

    // 5. Click Rename
    await page.getByText('重命名').click();

    // 6. Handle Inline Input
    // Expect input to appear in the sidebar item location
    const renameInput = page.locator('aside input[type="text"]');
    await expect(renameInput).toBeVisible();
    await expect(renameInput).toHaveValue(initialTitle);

    const newTitle = 'Renamed Inline ' + Date.now();
    await renameInput.fill(newTitle);
    await renameInput.press('Enter');

    // 7. Verify Immediate Update
    // Input should disappear, new text should be visible
    await expect(renameInput).not.toBeVisible();
    await expect(page.locator('aside').getByText(newTitle)).toBeVisible({ timeout: 5000 });
});
