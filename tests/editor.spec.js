import { test, expect } from '@playwright/test';

test.describe('Editor E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Go to dashboard
        await page.goto('/');

        // 2. Create new document
        await page.getByRole('button', { name: '新建文档' }).click();

        // 3. Wait for navigation to editor
        await page.waitForURL(/\/editor\/.+/);
    });

    test('should load editor and display default title', async ({ page }) => {
        const titleInput = page.getByTestId('doc-title-input');
        await expect(titleInput).toBeVisible();
        await expect(titleInput).toHaveValue('无标题文档');
    });

    test('should update document title and persist', async ({ page }) => {
        const titleInput = page.getByTestId('doc-title-input');

        // Edit title
        await titleInput.fill('My New Document Title');

        // Wait for auto-save to complete
        // The UI shows "保存中..." then "已保存到云端"
        await expect(page.getByText('已保存到云端')).toBeVisible({ timeout: 10000 });

        await page.reload();

        // Verify title persists
        await expect(page.getByTestId('doc-title-input')).toHaveValue('My New Document Title');
    });

    test('should display status badge', async ({ page }) => {
        const statusBadge = page.getByTestId('doc-status-badge');
        await expect(statusBadge).toBeVisible();
        // Default status is usually 'draft' (草稿)
        await expect(statusBadge).toHaveText('草稿');
    });

    test('should have share button', async ({ page }) => {
        const shareButton = page.getByTestId('share-button');
        await expect(shareButton).toBeVisible();
        await expect(shareButton).toBeEnabled();
    });
});
