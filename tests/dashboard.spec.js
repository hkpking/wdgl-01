import { test, expect } from '@playwright/test';

test('Dashboard loads correctly', async ({ page }) => {
    // Enable console logging
    page.on('console', msg => console.log(`[Browser] ${msg.text()}`));
    page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

    await page.goto('/');

    // Check for title
    await expect(page).toHaveTitle(/在线文档系统/);

    // Check for "New Document" button or "All Documents"
    await expect(page.getByText('全部文档')).toBeVisible();
    await expect(page.getByText('新建文档')).toBeVisible();
});
