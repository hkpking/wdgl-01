/**
 * 前端数据库配置文件
 * [重构版] 使用 Supabase 直连，统一数据库
 */

// Supabase 配置 (与 WDGL 共享同一数据库)
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 数据库类型枚举
const DATABASE_TYPES = {
    POSTGRESQL: 'postgresql',
    SUPABASE: 'supabase',
    MYSQL: 'mysql'
};

// 当前使用的数据库类型 (改为 Supabase)
const CURRENT_DB_TYPE = DATABASE_TYPES.SUPABASE;

// 表名映射 (旧表名 -> 新表名 with lctmr_ prefix)
const TABLE_MAPPING = {
    'factions': 'lctmr_factions',
    'categories': 'lctmr_categories',
    'chapters': 'lctmr_chapters',
    'sections': 'lctmr_sections',
    'blocks': 'lctmr_blocks',
    'profiles': 'lctmr_profiles',
    'user_progress': 'lctmr_user_progress',
    'scores': 'lctmr_profiles',
    'achievements': 'lctmr_achievements',
    'user_achievements': 'lctmr_user_achievements',
    'user_points_history': 'lctmr_points_history',
    'challenges': 'lctmr_challenges',
};

// 获取映射后的表名
function getMappedTableName(originalName) {
    return TABLE_MAPPING[originalName] || originalName;
}

// 获取 API 配置
async function getApiConfig() {
    return {
        useApiServer: false,  // 使用 Supabase 直连
        apiBaseUrl: SUPABASE_URL,
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_ANON_KEY,
    };
}

// 同步版本的getApiConfig
function getApiConfigSync() {
    return {
        useApiServer: false,  // 使用 Supabase 直连
        apiBaseUrl: SUPABASE_URL,
        supabaseUrl: SUPABASE_URL,
        supabaseKey: SUPABASE_ANON_KEY,
    };
}

// 是否使用 API 服务器 (改为 false，使用 Supabase 直连)
function useApiServer() {
    return false;
}

// 同步版本的useApiServer
function useApiServerSync() {
    return false;
}


// 验证配置
async function validateConfig() {
    try {
        const apiConfig = await getApiConfig();

        if (!apiConfig.supabaseUrl) {
            throw new Error('缺少必需的配置字段: supabaseUrl');
        }

        if (!apiConfig.supabaseKey) {
            throw new Error('缺少必需的配置字段: supabaseKey');
        }

        return true;
    } catch (error) {
        console.error('验证配置失败:', error.message);
        throw error;
    }
}

// 同步版本的validateConfig
function validateConfigSync() {
    try {
        const apiConfig = getApiConfigSync();

        if (!apiConfig.supabaseUrl) {
            throw new Error('缺少必需的配置字段: supabaseUrl');
        }

        if (!apiConfig.supabaseKey) {
            throw new Error('缺少必需的配置字段: supabaseKey');
        }

        return true;
    } catch (error) {
        console.error('验证配置失败:', error.message);
        throw error;
    }
}


// 获取数据库连接字符串（前端不需要，但保持兼容性）
function getConnectionString() {
    return null;
}

// 获取 JWT 配置
async function getJwtConfig() {
    try {
        // 尝试使用共享配置
        if (!sharedConfig) {
            await loadSharedConfig();
        }

        if (sharedConfig && sharedConfig.getJwtConfig) {
            const jwtConfig = await sharedConfig.getJwtConfig();
            return {
                secret: jwtConfig.secret, // 安全修复：移除默认值
                expiresIn: jwtConfig.expiresIn || '24h'
            };
        }
    } catch (error) {
        console.warn('获取共享JWT配置失败:', error.message);
    }

    // 安全修复：前端不应存储JWT密钥，应该从后端获取
    console.error('❌ 前端不应直接配置JWT密钥，JWT验证应由后端处理');
    throw new Error('JWT配置不可用。前端不应处理JWT密钥。');
}

// SVG viewBox 错误防护
function fixSvgViewBoxError() {
    // 监听DOM变化，修复错误的viewBox属性
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 检查SVG元素
                        const svgs = node.querySelectorAll ? node.querySelectorAll('svg') : [];
                        svgs.forEach(svg => {
                            const viewBox = svg.getAttribute('viewBox');
                            if (viewBox && viewBox.includes('%')) {
                                console.warn('修复错误的SVG viewBox:', viewBox);
                                // 移除错误的viewBox属性或设置为默认值
                                svg.removeAttribute('viewBox');
                            }
                        });

                        // 如果节点本身就是SVG
                        if (node.tagName === 'SVG') {
                            const viewBox = node.getAttribute('viewBox');
                            if (viewBox && viewBox.includes('%')) {
                                console.warn('修复错误的SVG viewBox:', viewBox);
                                node.removeAttribute('viewBox');
                            }
                        }
                    }
                });
            }
        });
    });

    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}

// 页面加载完成后启用防护
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixSvgViewBoxError);
    } else {
        fixSvgViewBoxError();
    }
}

// 初始化配置
async function initializeConfig() {
    try {
        // 初始化前端特有配置
        // 这些配置通常在config.js或local-config.js中已经设置
        return true;
    } catch (error) {
        console.error('❌ 配置初始化失败:', error.message);
        throw error;
    }
}

// 在浏览器环境中异步初始化配置
if (typeof window !== 'undefined') {
    // 延迟初始化，避免阻塞页面加载
    setTimeout(() => {
        initializeConfig();
    }, 1000);
}

// 导出配置
export {
    DATABASE_TYPES,
    CURRENT_DB_TYPE,
    getApiConfig,
    getApiConfigSync,
    useApiServer,
    useApiServerSync,
    validateConfig,
    validateConfigSync,
    getConnectionString,
    getJwtConfig,
    initializeConfig
};
