/**
 * 认证配置
 * 统一认证配置（暂时使用本地类型）
 */

// Supabase 配置
const SUPABASE_DIRECT_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_PROXY_URL = 'https://46.3.39.75:8443';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 环境变量
const useProxy = process.env.NEXT_PUBLIC_USE_SUPABASE_PROXY === 'true';
const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';

/**
 * 认证配置接口
 */
export interface AuthConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    useProxy: boolean;
    proxyUrl: string;
    productId: string;
    redirectUrl: string;
}

/**
 * 统一认证配置
 */
export const AUTH_CONFIG: AuthConfig = {
    supabaseUrl: SUPABASE_DIRECT_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    useProxy,
    proxyUrl: SUPABASE_PROXY_URL,
    productId: 'docs', // 当前产品 ID
    redirectUrl: '/',
};

/**
 * 是否跳过认证（开发环境）
 */
export const BYPASS_AUTH = bypassAuth;

/**
 * Mock 用户（开发环境使用）
 */
export const MOCK_USER = {
    uid: 'dev-mock-user',
    email: 'dev@example.com',
    displayName: 'Dev Mock User',
};
