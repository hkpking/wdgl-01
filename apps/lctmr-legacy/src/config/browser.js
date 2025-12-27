/**
 * @file 浏览器兼容的配置管理系统
 * @description 专为浏览器环境设计的配置系统，不依赖Node.js环境变量
 * @version 1.0.0
 */

// 环境配置
export const ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};

// 获取当前环境 - 浏览器兼容版本
export const getCurrentEnvironment = () => {
    // 浏览器环境检测
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const port = window.location.port;
        
        // 本地开发环境
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return ENVIRONMENT.DEVELOPMENT;
        }
        
        // 生产环境
        return ENVIRONMENT.PRODUCTION;
    }
    
    // 默认开发环境
    return ENVIRONMENT.DEVELOPMENT;
};

// API 配置
export const API_CONFIG = {
    development: {
        BASE_URL: 'http://localhost:3011',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    production: {
        BASE_URL: 'https://api.lctmr.com',
        TIMEOUT: 15000,
        RETRY_ATTEMPTS: 2
    }
};

// 应用配置
export const APP_CONFIG = {
    NAME: 'LCTMR v2.0',
    VERSION: '2.0.0',
    
    // 功能开关
    FEATURES: {
        MUSIC_CONTROL: true,
        ACHIEVEMENTS: true,
        LEADERBOARD: true,
        ADMIN_PANEL: true
    },
    
    // UI配置
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_TIMEOUT: 3000,
        LOADING_MIN_DURATION: 500
    },
    
    // 缓存配置
    CACHE: {
        MAX_SIZE: 100,
        TTL: 5 * 60 * 1000, // 5分钟
        PRELOAD_ENDPOINTS: [
            '/api/learning/categories',
            '/api/user/achievements',
            '/api/leaderboard'
        ]
    }
};

// 安全配置
export const SECURITY_CONFIG = {
    JWT: {
        EXPIRY: '7d',
        ALGORITHM: 'HS256'
    },
    
    CORS: {
        ORIGINS: getCurrentEnvironment() === ENVIRONMENT.PRODUCTION 
            ? ['https://lctmr.com', 'https://www.lctmr.com']
            : ['http://localhost:3000', 'http://localhost:5000']
    },
    
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15分钟
        MAX_REQUESTS: 100
    }
};

// 统一配置获取函数
export const getConfig = () => {
    const environment = getCurrentEnvironment();
    
    return {
        environment,
        api: API_CONFIG[environment],
        app: APP_CONFIG,
        security: SECURITY_CONFIG
    };
};

// 配置验证函数
export const validateConfig = () => {
    const config = getConfig();
    
    try {
        // 验证API配置
        if (!config.api.BASE_URL) {
            throw new Error('API_BASE_URL 未配置');
        }
        
        console.log('✅ 浏览器配置验证通过');
        return true;
    } catch (error) {
        console.error('❌ 配置验证失败:', error.message);
        throw error;
    }
};

// 导出默认配置
export default getConfig();