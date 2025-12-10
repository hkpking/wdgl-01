/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 */
import { createClient } from '@supabase/supabase-js';

// Supabase 项目配置
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// 导出配置用于其他模块
export const config = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
};
