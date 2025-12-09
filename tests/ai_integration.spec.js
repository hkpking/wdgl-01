import { test, expect } from '@playwright/test';

test('AI Magic Command Flow', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    // 1. Go to Editor
    await page.goto('http://localhost:3000/editor/ai-test-doc');

    // Wait for editor to load (look for the main editor area)
    await page.waitForSelector('.bg-slate-100\\/50', { timeout: 10000 });

    // 2. Open Magic Command (Cmd+K)
    await page.keyboard.press('Meta+k');

    // Verify overlay is visible
    const input = page.locator('input[placeholder*="Ask AI"]');
    await expect(input).toBeVisible();

    // 3. Type command
    await input.fill('outline for a coffee shop business plan');

    // 4. Submit
    await page.keyboard.press('Enter');

    // 5. Wait for result
    // Look for result area
    await expect(page.locator('.prose')).toBeVisible();
    await expect(page.locator('.prose')).toContainText('MOCK'); // Match uppercase MOCK

    // Wait for stream to finish (loader disappears)
    await expect(page.locator('.animate-spin')).not.toBeVisible();

    // 6. Insert
    await page.getByRole('button', { name: 'Insert' }).click();

    // 7. Verify blocks added
    // We expect multiple blocks now
    const blocks = page.locator('.block-item');
    const count = await blocks.count();
    // Wait for blocks to be added
    await expect(async () => {
        const count = await blocks.count();
        expect(count).toBeGreaterThan(1);
    }).toPass({ timeout: 5000 });
});
