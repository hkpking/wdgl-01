
import { test, expect } from '@playwright/test';

test('Sync: Sidebar Rename Updates Editor Title', async ({ page }) => {
    // 1. Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@123.com');
    await page.fill('input[type="password"]', '1234567');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');

    // 2. Navigate to KB
    const firstTeamLink = page.locator('a[href^="/teams/"]').first();
    await firstTeamLink.click();
    await page.waitForURL(/\/teams\/[^/]+$/);
    const kbCard = page.locator('.bg-white.rounded-xl.border').first();
    await kbCard.click();
    await page.waitForURL(/\/teams\/[^/]+\/kb\/[^/]+/);

    // 3. Create Doc
    await page.click('button:has-text("新建")');
    await page.locator('button:has-text("文档")').click();
    await expect(page).toHaveURL(/doc=/);

    // Robustness: Wait for editor content to indicate load
    // Check for either the editor content area or the toolbar to ensuring loading finished
    await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 20000 }).catch(() => {
        console.log('Reloading due to potential hang...');
        return page.reload().then(() => expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 20000 }));
    });

    // Set initial title
    const initialTitle = 'Sync Test Doc ' + Date.now();
    const titleInput = page.getByTestId('doc-title-input');
    await expect(titleInput).toBeVisible({ timeout: 10000 });

    await titleInput.fill(initialTitle);
    await titleInput.blur();

    // Wait for sidebar update
    await expect(page.locator('aside').getByText(initialTitle).first()).toBeVisible();

    // 4. Rename in Sidebar while Editor is Open
    const docItem = page.locator('aside').getByText(initialTitle).first();
    await docItem.click({ button: 'right' });
    await page.getByText('重命名').click();

    const newTitle = 'Synced Title ' + Date.now();
    const renameInput = page.locator('aside input[type="text"]');
    await expect(renameInput).toBeVisible();
    await renameInput.fill(newTitle);
    await renameInput.press('Enter');

    // 5. Verify Editor Title Updates
    // The editor title input should now have the new value
    await expect(titleInput).toHaveValue(newTitle, { timeout: 10000 });
});
