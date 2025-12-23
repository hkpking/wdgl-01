/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 */
// 使用 @supabase/ssr 创建支持 Cookie 的客户端
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Supabase 项目配置
// 生产环境（阿里云/国内用户）使用香港代理降低延迟
// 开发环境（美国）直连 Supabase
const SUPABASE_DIRECT_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_PROXY_URL = 'https://46.3.39.75:8443';

// 检测是否为生产环境（bpm-auto.com 域名）
const isProduction: boolean = typeof window !== 'undefined' &&
    window.location.hostname.includes('bpm-auto.com');

const SUPABASE_URL: string = isProduction ? SUPABASE_PROXY_URL : SUPABASE_DIRECT_URL;
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 创建 Supabase 客户端 (Browser Side)
// 自动在 Cookie 中管理 session，与 Middleware 同步
export const supabase: SupabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Supabase 配置 */
export interface SupabaseConfig {
    url: string;
    anonKey: string;
}

// 导出配置用于其他模块
export const config: SupabaseConfig = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
};
