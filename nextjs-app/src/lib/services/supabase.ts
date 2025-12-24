/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 */
// 使用 @supabase/ssr 创建支持 Cookie 的客户端
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Supabase 项目配置
// 注意：香港代理 SSL 证书无效，临时禁用，全部直连 Supabase
// TODO: 后续为代理配置有效 SSL 证书后再启用
const SUPABASE_DIRECT_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
// const SUPABASE_PROXY_URL = 'https://46.3.39.75:8443'; // 暂时禁用

// 临时方案：所有环境都直连 Supabase
// 注：国内用户可能会有延迟，但至少能正常使用
const SUPABASE_URL: string = SUPABASE_DIRECT_URL;
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbnc3bC8FS8OGw';

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
