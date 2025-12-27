/**
 * 表格编辑器 E2E 测试 - 适配新团队/知识库架构
 */
import { test, expect, Page } from '@playwright/test';

// 测试账号 (需要在 Supabase 中预先创建)
const TEST_EMAIL = process.env.TEST_EMAIL || 'admin@123.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '1234567';

/**
 * 登录辅助函数
 */
async function login(page: Page) {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // 检查是否在登录页面
    const loginButton = page.locator('button:has-text("登录")');
    if (await loginButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.fill('input[type="email"], input[placeholder*="email"]', TEST_EMAIL);
        await page.fill('input[type="password"], input[placeholder*="字符"]', TEST_PASSWORD);
        await page.click('button:has-text("登录")');
        await page.waitForLoadState('networkidle');
        // 等待登录完成
        await page.waitForTimeout(2000);
    }
}

/**
 * 获取第一个可用的团队和知识库
 */
async function getFirstTeamAndKB(page: Page): Promise<{ teamHref: string | null }> {
    // 在侧边栏找到第一个团队链接
    const teamLink = page.locator('nav a[href^="/teams/"]').first();
    if (await teamLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        return { teamHref: await teamLink.getAttribute('href') };
    }
    return { teamHref: null };
}

test.describe('表格编辑器 - 团队知识库模式', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('应该能在团队知识库中创建和保存表格', async ({ page }) => {
        // 1. 获取第一个团队
        const { teamHref } = await getFirstTeamAndKB(page);
        test.skip(!teamHref, '没有可用的团队，跳过测试');

        // 2. 进入团队页面
        await page.goto(teamHref!);
        await page.waitForLoadState('networkidle');

        // 3. 找到第一个知识库并进入
        const kbCard = page.locator('a[href*="/kb/"]').first();
        if (!await kbCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            test.skip(true, '团队中没有知识库，跳过测试');
            return;
        }
        await kbCard.click();
        await page.waitForLoadState('networkidle');

        // 4. 点击"新建"按钮
        const createButton = page.locator('button:has-text("新建")');
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();

        // 5. 在弹窗中选择创建表格
        const spreadsheetOption = page.locator('text=表格').or(page.locator('text=电子表格'));
        await expect(spreadsheetOption.first()).toBeVisible({ timeout: 5000 });
        await spreadsheetOption.first().click();

        // 6. 等待表格编辑器加载
        await page.waitForTimeout(3000);

        // 检查 URL 是否包含 sheet 参数或跳转到 spreadsheet 页面
        const url = page.url();
        expect(url).toMatch(/sheet=|spreadsheet/);

        // 7. 验证表格编辑器存在
        const spreadsheetEditor = page.locator('.fortune-container, [class*="luckysheet"], [class*="Workbook"]');
        await expect(spreadsheetEditor.first()).toBeVisible({ timeout: 15000 });

        // 8. 查找并修改标题
        const titleInput = page.locator('input[placeholder*="标题"], input[placeholder*="表格"]');
        if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await titleInput.fill('E2E测试表格');
        }

        // 9. 等待自动保存或点击保存按钮
        await page.waitForTimeout(3000);

        // 尝试点击保存按钮
        const saveButton = page.locator('button:has-text("保存")');
        if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await saveButton.click();
            await page.waitForTimeout(2000);
        }

        // 10. 验证保存状态
        const savedIndicator = page.locator('text=已保存').or(page.locator('text=保存成功'));
        await expect(savedIndicator.first()).toBeVisible({ timeout: 10000 });
    });

    test('应该能修改表格标题并保存', async ({ page }) => {
        // 1. 获取第一个团队
        const { teamHref } = await getFirstTeamAndKB(page);
        test.skip(!teamHref, '没有可用的团队，跳过测试');

        // 2. 进入团队页面
        await page.goto(teamHref!);
        await page.waitForLoadState('networkidle');

        // 3. 进入知识库
        const kbCard = page.locator('a[href*="/kb/"]').first();
        if (!await kbCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            test.skip(true, '团队中没有知识库');
            return;
        }
        await kbCard.click();
        await page.waitForLoadState('networkidle');

        // 4. 查找已有表格或创建新表格
        const existingSheet = page.locator('[data-type="spreadsheet"], a[href*="sheet="]').first();
        if (await existingSheet.isVisible({ timeout: 3000 }).catch(() => false)) {
            await existingSheet.click();
        } else {
            // 创建新表格
            await page.click('button:has-text("新建")');
            await page.click('text=表格');
        }

        await page.waitForTimeout(3000);

        // 5. 修改标题
        const titleInput = page.locator('input[placeholder*="标题"], input[placeholder*="表格"], input.text-lg');
        await expect(titleInput.first()).toBeVisible({ timeout: 10000 });

        const newTitle = `测试标题_${Date.now()}`;
        await titleInput.first().fill(newTitle);
        await titleInput.first().blur();

        // 6. 等待保存
        await page.waitForTimeout(3000);

        // 7. 刷新验证
        await page.reload();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // 8. 验证标题保留
        const updatedTitle = page.locator(`input[value*="测试标题"]`);
        const titleExists = await updatedTitle.isVisible({ timeout: 5000 }).catch(() => false);

        // 如果找不到精确匹配，检查页面是否包含标题文本
        if (!titleExists) {
            const bodyText = await page.textContent('body');
            expect(bodyText).toContain('测试标题');
        }
    });

    test('应该能使用 Ctrl+S 手动保存', async ({ page }) => {
        const { teamHref } = await getFirstTeamAndKB(page);
        test.skip(!teamHref, '没有可用的团队');

        await page.goto(teamHref!);
        await page.waitForLoadState('networkidle');

        const kbCard = page.locator('a[href*="/kb/"]').first();
        if (!await kbCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            test.skip(true, '团队中没有知识库');
            return;
        }
        await kbCard.click();
        await page.waitForLoadState('networkidle');

        // 创建新表格
        await page.click('button:has-text("新建")');
        await page.click('text=表格');
        await page.waitForTimeout(3000);

        // 使用快捷键保存
        await page.keyboard.press('Control+s');

        // 验证保存状态显示
        const savedIndicator = page.locator('text=保存').or(page.locator('text=已保存'));
        await expect(savedIndicator.first()).toBeVisible({ timeout: 5000 });
    });
});

test.describe('表格编辑器 - 独立页面访问', () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('直接访问表格页面应该能正常加载', async ({ page }) => {
        // 尝试从首页获取表格链接
        const { teamHref } = await getFirstTeamAndKB(page);

        if (teamHref) {
            await page.goto(teamHref);
            await page.waitForLoadState('networkidle');

            // 进入知识库
            const kbCard = page.locator('a[href*="/kb/"]').first();
            if (await kbCard.isVisible({ timeout: 3000 }).catch(() => false)) {
                await kbCard.click();
                await page.waitForLoadState('networkidle');

                // 寻找表格
                const sheetLink = page.locator('[data-type="spreadsheet"]').first();
                if (await sheetLink.isVisible({ timeout: 3000 }).catch(() => false)) {
                    await sheetLink.click();
                    await page.waitForLoadState('networkidle');

                    // 验证编辑器加载
                    const editor = page.locator('.fortune-container, [class*="luckysheet"]');
                    await expect(editor.first()).toBeVisible({ timeout: 15000 });
                }
            }
        }
    });
});
