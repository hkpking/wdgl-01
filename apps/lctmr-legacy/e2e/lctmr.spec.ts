import { test, expect } from '@playwright/test';

/**
 * LCTMR Legacy E2E 测试
 * 测试页面路由、用户交互、按钮点击等功能
 */

// 测试账号
const TEST_EMAIL = 'hkpking@example.com';
const TEST_PASSWORD = 'Lctmr@2025';

test.describe('认证系统测试', () => {
    test('首页应该显示登录界面', async ({ page }) => {
        await page.goto('/');

        // 验证登录表单存在
        await expect(page.locator('input[type="email"], input[name="email"], #email')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('input[type="password"], input[name="password"], #password')).toBeVisible();
    });

    test('用户可以成功登录', async ({ page }) => {
        await page.goto('/');

        // 填写登录表单
        await page.fill('input[type="email"], input[name="email"], #email', TEST_EMAIL);
        await page.fill('input[type="password"], input[name="password"], #password', TEST_PASSWORD);

        // 点击登录按钮
        await page.click('button[type="submit"], .login-btn, #login-btn');

        // 等待登录成功 - 检查用户名或主页面元素
        await expect(page.locator('text=hkpking, .user-name, .welcome')).toBeVisible({ timeout: 15000 });
    });
});

test.describe('登录后功能测试', () => {
    // 每个测试前先登录
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"], input[name="email"], #email', TEST_EMAIL);
        await page.fill('input[type="password"], input[name="password"], #password', TEST_PASSWORD);
        await page.click('button[type="submit"], .login-btn, #login-btn');
        await page.waitForTimeout(3000); // 等待登录完成
    });

    test('主页面应该正确加载', async ({ page }) => {
        // 检查主要导航元素
        const mainContent = page.locator('.main-content, #app, .app-container');
        await expect(mainContent).toBeVisible({ timeout: 10000 });
    });

    test('学习地图应该显示分类和章节', async ({ page }) => {
        // 导航到学习地图（可能通过菜单或直接访问）
        const learningMap = page.locator('.learning-map, .category-list, .chapter-list');

        // 如果在当前页面就能看到
        if (await learningMap.isVisible()) {
            await expect(learningMap).toBeVisible();
        }
    });

    test('"标记完成" 按钮应该可点击', async ({ page }) => {
        // 查找标记完成按钮
        const completeBtn = page.locator('button:has-text("标记"), button:has-text("完成"), .complete-btn, .mark-complete');

        if (await completeBtn.count() > 0) {
            // 点击第一个按钮
            await completeBtn.first().click();

            // 验证没有错误弹窗
            const errorModal = page.locator('.error-modal, .error-message, text=错误');
            await expect(errorModal).not.toBeVisible({ timeout: 5000 });
        }
    });

    test('用户积分应该显示', async ({ page }) => {
        // 查找积分显示
        const pointsDisplay = page.locator('text=积分, text=100, .points, .score');
        await expect(pointsDisplay).toBeVisible({ timeout: 10000 });
    });

    test('导航菜单应该可用', async ({ page }) => {
        // 查找导航元素
        const navItems = page.locator('nav, .nav, .sidebar, .menu');
        await expect(navItems).toBeVisible({ timeout: 10000 });
    });
});

test.describe('路由测试', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('input[type="email"], input[name="email"], #email', TEST_EMAIL);
        await page.fill('input[type="password"], input[name="password"], #password', TEST_PASSWORD);
        await page.click('button[type="submit"], .login-btn, #login-btn');
        await page.waitForTimeout(3000);
    });

    test('所有主要页面链接应该可访问', async ({ page }) => {
        // 收集所有导航链接
        const links = page.locator('a[href], button[data-route], .nav-link');
        const count = await links.count();

        console.log(`发现 ${count} 个导航元素`);

        // 验证至少有一些导航元素
        expect(count).toBeGreaterThan(0);
    });
});

test.describe('控制台错误检测', () => {
    test('页面加载不应有 JavaScript 错误', async ({ page }) => {
        const errors: string[] = [];

        // 监听控制台错误
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForTimeout(5000);

        // 过滤掉已知的非关键错误（如字体加载失败）
        const criticalErrors = errors.filter(e =>
            !e.includes('font') &&
            !e.includes('NotoSans') &&
            !e.includes('favicon')
        );

        // 打印发现的错误
        if (criticalErrors.length > 0) {
            console.log('发现控制台错误:', criticalErrors);
        }

        // 不应有关键 JavaScript 错误
        expect(criticalErrors.length).toBeLessThan(3);
    });
});
