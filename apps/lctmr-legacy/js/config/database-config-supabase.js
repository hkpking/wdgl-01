/**
 * 流程天命人 - 数据库配置 (Supabase 直连版)
 * 替代原有的 database-config.js，直接使用 Supabase
 */

// Supabase 配置
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 表名映射 (旧表名 -> 新表名 with lctmr_ prefix)
const TABLE_MAPPING = {
    'factions': 'lctmr_factions',
    'categories': 'lctmr_categories',
    'chapters': 'lctmr_chapters',
    'sections': 'lctmr_sections',
    'blocks': 'lctmr_sections',  // blocks 合并到 sections
    'profiles': 'lctmr_profiles',
    'user_progress': 'lctmr_user_progress',
    'scores': 'lctmr_profiles',  // scores 合并到 profiles
    'achievements': 'lctmr_achievements',
    'user_achievements': 'lctmr_user_achievements',
    'user_points_history': 'lctmr_points_history',
};

// 配置对象
let configInitialized = false;

// 初始化配置
export async function initializeConfig() {
    if (configInitialized) return;

    // 设置全局配置
    window.APP_CONFIG = window.APP_CONFIG || {};
    window.APP_CONFIG.SUPABASE_URL = SUPABASE_URL;
    window.APP_CONFIG.SUPABASE_KEY = SUPABASE_ANON_KEY;

    configInitialized = true;
}

// 获取 API 配置 (异步)
export async function getApiConfig() {
    await initializeConfig();
    return {
        apiBaseUrl: SUPABASE_URL,
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_ANON_KEY,
    };
}

// 获取 API 配置 (同步)
export function getApiConfigSync() {
    return {
        apiBaseUrl: SUPABASE_URL,
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_ANON_KEY,
    };
}

// 判断是否使用 API 服务器 (现在总是返回 false，使用 Supabase 直连)
export async function useApiServer() {
    return false; // 使用 Supabase 直连
}

export function useApiServerSync() {
    return false; // 使用 Supabase 直连
}

// 验证配置
export async function validateConfig() {
    await initializeConfig();

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase 配置缺失');
    }

    return true;
}

export function validateConfigSync() {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase 配置缺失');
    }
    return true;
}

// 获取映射后的表名
export function getMappedTableName(originalName) {
    return TABLE_MAPPING[originalName] || originalName;
}

// 导出配置
export const LCTMR_CONFIG = {
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    tableMapping: TABLE_MAPPING,
};

// 自动初始化
initializeConfig();
