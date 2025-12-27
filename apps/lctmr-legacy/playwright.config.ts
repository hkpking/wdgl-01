import { defineConfig, devices } from '@playwright/test';

/**
 * LCTMR Legacy Playwright 配置
 * 用于自动化 UI 测试：页面路由、按钮点击、表单提交等
 */
export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['list']
    ],
    use: {
        baseURL: 'http://localhost:8080',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
    ],
    webServer: {
        command: 'python3 -m http.server 8080',
        url: 'http://localhost:8080',
        reuseExistingServer: true,
        timeout: 30 * 1000,
    },
});
