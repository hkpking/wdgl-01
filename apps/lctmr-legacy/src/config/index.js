/**
 * @file 统一配置管理系统
 * @description 整合所有配置文件，提供统一的配置访问接口
 * @version 1.0.0
 */

// 环境配置
export const ENVIRONMENT = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test'
};

// 获取当前环境
export const getCurrentEnvironment = () => {
    return process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT;
};

// API 配置
export const API_CONFIG = {
    development: {
        BASE_URL: 'http://localhost:3011',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3
    },
    production: {
        BASE_URL: process.env.API_BASE_URL || 'https://api.lctmr.com',
        TIMEOUT: 15000,
        RETRY_ATTEMPTS: 2
    }
};

// 数据库配置
export const DATABASE_CONFIG = {
    TYPES: {
        POSTGRESQL: 'postgresql'
    },
    CURRENT_TYPE: 'postgresql',
    
    // 配置获取函数
    getConfig(environment = getCurrentEnvironment(), isBackend = false) {
        const configs = {
            development: {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                user: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'lctmr_dev'
            },
            production: {
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT),
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            }
        };
        
        return configs[environment];
    },
    
    // 获取连接字符串
    getConnectionString(environment = getCurrentEnvironment()) {
        const config = this.getConfig(environment);
        return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
    },
    
    // 验证配置
    validate(config) {
        const required = ['host', 'port', 'user', 'password', 'database'];
        const missing = required.filter(field => !config[field]);
        
        if (missing.length > 0) {
            throw new Error(`缺少必需的数据库配置字段: ${missing.join(', ')}`);
        }
        
        if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
            throw new Error(`无效的数据库端口: ${config.port}`);
        }
        
        return true;
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
        database: DATABASE_CONFIG.getConfig(environment),
        app: APP_CONFIG,
        security: SECURITY_CONFIG
    };
};

// 配置验证函数
export const validateConfig = () => {
    const config = getConfig();
    
    try {
        // 验证数据库配置
        DATABASE_CONFIG.validate(config.database);
        
        // 验证API配置
        if (!config.api.BASE_URL) {
            throw new Error('API_BASE_URL 未配置');
        }
        
        console.log('✅ 配置验证通过');
        return true;
    } catch (error) {
        console.error('❌ 配置验证失败:', error.message);
        throw error;
    }
};

// 导出默认配置
export default getConfig();