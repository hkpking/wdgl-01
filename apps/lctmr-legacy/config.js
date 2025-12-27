/**
 * 前端环境配置文件
 * [简化版] 使用 Supabase 直连，无需区分开发/生产环境
 */

// Supabase 配置 (统一使用相同的 Supabase 实例)
window.APP_CONFIG = window.APP_CONFIG || {};
window.APP_CONFIG.SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
window.APP_CONFIG.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 门户 URL (用于 SSO 跳转)
window.PORTAL_URL = 'https://portal.xjio.cn';

// 数据库类型
window.DB_TYPE = 'supabase';

console.log('🔧 环境配置已加载:', {
    supabaseUrl: window.APP_CONFIG.SUPABASE_URL,
    dbType: window.DB_TYPE
});
