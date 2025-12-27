
import { test, expect } from '@playwright/test';

test('Unified KB Flow: Login, Create, and Title Sync', async ({ page }) => {
    // 1. 登录
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@123.com');
    await page.fill('input[type="password"]', '1234567');
    await page.click('button[type="submit"]');

    // 等待登录成功并跳转
    await page.waitForURL('**/dashboard**');

    // 2. 进入第一个团队的知识库
    // 假设首页有团队链接，或者直接进入
    // 这里我们先找到第一个团队链接
    const firstTeamLink = page.locator('a[href^="/teams/"]').first();
    await expect(firstTeamLink).toBeVisible();
    await firstTeamLink.click();

    // 等待进入团队页面，然后点击知识库
    // 假设侧边栏有知识库入口
    // 或者直接构造 URL 访问也行，但模拟点击更好
    // 这里简化处理，查找页面上的 "知识库" 链接或卡片
    const kbLink = page.getByText('知识库').first(); // Adjust selector as needed
    // 如果没有明确的 KB 链接，可能需要先进入 KB 列表页
    // 假设团队首页就是 KB 列表或有入口
    // 我们尝试寻找知识库卡片
    // 假设卡片上有 "进入" 按钮

    // 如果页面结构比较复杂，我们可以直接访问一个已知的 KB URL 模板，或者先获取 Team ID
    // 为了稳健，我们通过 UI 交互
    await page.waitForURL(/\/teams\/[^/]+$/);

    // 查找页面上的知识库入口 (假设是卡片)
    const kbCard = page.locator('.bg-white.rounded-xl.border').first();
    await kbCard.click();

    // 3. 验证知识库页面加载 (Unified View)
    await page.waitForURL(/\/teams\/[^/]+\/kb\/[^/]+/);

    // 验证侧边栏存在
    await expect(page.locator('aside')).toBeVisible();

    // 4. 创建新文档
    await page.click('button:has-text("新建")');
    // 弹窗中选择创建文档
    await page.locator('button:has-text("文档")').click();

    // 验证跳转到文档视图 (URL 包含 ?doc=...)
    await expect(page).toHaveURL(/doc=/);

    // 5. 验证侧边栏出现了新文档 (无标题文档)
    // Wait for loader to disappear
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });

    // Check sidebar visibility
    await expect(page.locator('aside')).toBeVisible();

    const newDocItem = page.locator('aside').getByText('无标题文档').first();
    await expect(newDocItem).toBeVisible();

    // 6. 验证标题同步 (Optimistic Update)
    // 找到编辑器标题输入框
    const titleInput = page.getByTestId('doc-title-input');
    await expect(titleInput).toBeVisible();

    const testTitle = 'Automated Test Doc ' + Date.now();
    await titleInput.fill(testTitle);

    // 验证侧边栏立即更新 (无需等待保存)
    const sidebarItem = page.locator('aside').getByText(testTitle).first();
    await expect(sidebarItem).toBeVisible();

    console.log('Title Sync Verified!');
});
