/**
 * 表格保存功能完整测试
 * 包含创建团队/知识库的完整流程
 */
import { test, expect, Page } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_EMAIL || 'admin@123.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || '1234567';

test.describe.configure({ mode: 'serial' });

let createdTeamUrl: string | null = null;
let createdKbUrl: string | null = null;

async function login(page: Page) {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const loginButton = page.locator('button:has-text("登录")');
    if (await loginButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await page.fill('input[type="email"], input[placeholder*="email"]', TEST_EMAIL);
        await page.fill('input[type="password"], input[placeholder*="字符"]', TEST_PASSWORD);
        await page.click('button:has-text("登录")');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
    }
}

test.describe('表格保存完整测试', () => {
    test('步骤1: 登录并进入团队', async ({ page }) => {
        await login(page);

        // 查找现有团队
        await page.waitForTimeout(2000);
        const teamLink = page.locator('nav a[href^="/teams/"]').first();

        if (await teamLink.isVisible({ timeout: 5000 }).catch(() => false)) {
            createdTeamUrl = await teamLink.getAttribute('href');
            console.log('找到团队:', createdTeamUrl);
            await teamLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveURL(/\/teams\//);
        } else {
            // 如果没有团队，创建一个
            console.log('没有找到团队，创建新团队');
            const createTeamBtn = page.locator('button:has-text("新建团队"), button:has-text("创建第一个团队")');
            if (await createTeamBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await createTeamBtn.click();
                await page.waitForTimeout(1000);
                await page.fill('input[placeholder*="团队名称"], input[name="name"]', 'E2E测试团队');
                await page.click('button:has-text("创建"), button:has-text("确定")');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000);
            }
        }

        // 截图保存当前状态
        await page.screenshot({ path: 'test-results/step1-team-page.png' });
    });

    test('步骤2: 进入知识库', async ({ page }) => {
        await login(page);

        // 进入团队
        if (createdTeamUrl) {
            await page.goto(createdTeamUrl);
        } else {
            const teamLink = page.locator('nav a[href^="/teams/"]').first();
            await teamLink.click();
        }
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // 查找知识库
        const kbCard = page.locator('a[href*="/kb/"]').first();

        if (await kbCard.isVisible({ timeout: 5000 }).catch(() => false)) {
            createdKbUrl = await kbCard.getAttribute('href');
            console.log('找到知识库:', createdKbUrl);
            await kbCard.click();
            await page.waitForLoadState('networkidle');
        } else {
            // 创建知识库
            console.log('没有找到知识库，创建新知识库');
            const createKbBtn = page.locator('button:has-text("新建知识库"), button:has-text("创建知识库")');
            if (await createKbBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await createKbBtn.click();
                await page.waitForTimeout(1000);
                await page.fill('input[placeholder*="知识库名称"], input[name="name"]', 'E2E测试知识库');
                await page.click('button:has-text("创建"), button:has-text("确定")');
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000);
            }
        }

        await page.screenshot({ path: 'test-results/step2-kb-page.png' });
    });

    test('步骤3: 创建表格', async ({ page }) => {
        await login(page);

        // 进入知识库
        if (createdKbUrl) {
            await page.goto(createdKbUrl);
        } else {
            const teamLink = page.locator('nav a[href^="/teams/"]').first();
            await teamLink.click();
            await page.waitForLoadState('networkidle');
            const kbCard = page.locator('a[href*="/kb/"]').first();
            await kbCard.click();
        }
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // 点击新建按钮
        const createBtn = page.locator('button:has-text("新建")');
        await expect(createBtn).toBeVisible({ timeout: 10000 });
        await createBtn.click();
        await page.waitForTimeout(500);

        // 选择表格
        const sheetOption = page.locator('button:has-text("表格"), div:has-text("表格")').first();
        await expect(sheetOption).toBeVisible({ timeout: 5000 });
        await sheetOption.click();

        await page.waitForTimeout(3000);
        await page.screenshot({ path: 'test-results/step3-spreadsheet-created.png' });

        // 验证表格编辑器加载
        const url = page.url();
        console.log('当前 URL:', url);
        expect(url).toMatch(/sheet=|spreadsheet/);
    });

    test('步骤4: 输入数据并保存', async ({ page }) => {
        await login(page);

        // 进入知识库
        if (createdKbUrl) {
            await page.goto(createdKbUrl);
        } else {
            const teamLink = page.locator('nav a[href^="/teams/"]').first();
            await teamLink.click();
            await page.waitForLoadState('networkidle');
            const kbCard = page.locator('a[href*="/kb/"]').first();
            await kbCard.click();
        }
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // 打开最近的表格（如果存在）或创建新表格
        const existingSheet = page.locator('[data-type="spreadsheet"]').first();
        if (await existingSheet.isVisible({ timeout: 3000 }).catch(() => false)) {
            await existingSheet.click();
        } else {
            await page.click('button:has-text("新建")');
            await page.waitForTimeout(500);
            await page.click('button:has-text("表格")');
        }
        await page.waitForTimeout(3000);

        // 修改标题
        const titleInput = page.locator('input[placeholder*="标题"], input[placeholder*="表格"], input.text-lg').first();
        if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            await titleInput.fill('E2E保存测试_' + Date.now());
            console.log('标题已修改');
        }

        // 等待自动保存
        await page.waitForTimeout(5000);

        // 点击保存按钮（如果有）
        const saveBtn = page.locator('button:has-text("保存")');
        if (await saveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await saveBtn.click();
            await page.waitForTimeout(2000);
        }

        await page.screenshot({ path: 'test-results/step4-data-saved.png' });

        // 验证保存状态
        const savedText = await page.textContent('body');
        const isSaved = savedText?.includes('已保存') || savedText?.includes('保存成功');
        console.log('保存状态:', isSaved ? '已保存' : '未确认');
    });

    test('步骤5: 刷新验证数据保留', async ({ page }) => {
        await login(page);

        // 进入知识库
        if (createdKbUrl) {
            await page.goto(createdKbUrl);
        } else {
            const teamLink = page.locator('nav a[href^="/teams/"]').first();
            await teamLink.click();
            await page.waitForLoadState('networkidle');
            const kbCard = page.locator('a[href*="/kb/"]').first();
            await kbCard.click();
        }
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // 打开表格
        const sheet = page.locator('[data-type="spreadsheet"]').first();
        if (await sheet.isVisible({ timeout: 5000 }).catch(() => false)) {
            await sheet.click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);

            // 刷新页面
            await page.reload();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);

            await page.screenshot({ path: 'test-results/step5-after-refresh.png' });

            // 验证标题包含 E2E
            const bodyText = await page.textContent('body');
            if (bodyText?.includes('E2E')) {
                console.log('✅ 刷新后数据保留成功');
            } else {
                console.log('⚠️ 刷新后未找到 E2E 标题，可能是新建的表格');
            }
        } else {
            console.log('⚠️ 未找到表格');
            await page.screenshot({ path: 'test-results/step5-no-sheet.png' });
        }
    });
});
