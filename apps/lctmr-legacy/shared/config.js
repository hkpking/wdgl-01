/**
 * 共享配置模块
 * 统一管理前后端共用的配置逻辑
 */

// 数据库类型枚举
export const DATABASE_TYPES = {
    POSTGRESQL: 'postgresql',
    SUPABASE: 'supabase',
    MYSQL: 'mysql'
};

// 当前使用的数据库类型
export const CURRENT_DB_TYPE = DATABASE_TYPES.POSTGRESQL;

/**
 * 获取数据库配置
 * @param {string} environment - 环境类型 (development, production)
 * @param {boolean} isBackend - 是否为后端配置
 * @returns {Object} 数据库配置对象
 */
export function getDatabaseConfig(environment = 'development', isBackend = false) {
    // 基础配置
    const baseConfig = {
        postgresql: {
            development: {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT) || 5432,
                user: process.env.DB_USER || 'web_app',
                password: process.env.DB_PASSWORD || 'Dslr*2025#app',
                database: process.env.DB_NAME || 'lctmr_development',
                ssl: process.env.DB_SSL === 'true' || false,
            },
            production: {
                // 生产环境强制要求环境变量（安全修复）
                host: process.env.DB_HOST || (() => { throw new Error('生产环境必须设置 DB_HOST 环境变量'); })(),
                port: parseInt(process.env.DB_PORT) || 5432,
                user: process.env.DB_USER || (() => { throw new Error('生产环境必须设置 DB_USER 环境变量'); })(),
                password: process.env.DB_PASSWORD || (() => { throw new Error('生产环境必须设置 DB_PASSWORD 环境变量'); })(),
                database: process.env.DB_NAME || (() => { throw new Error('生产环境必须设置 DB_NAME 环境变量'); })(),
                ssl: process.env.DB_SSL === 'true' || false,
            }
        }
    };
    
    const config = baseConfig.postgresql[environment];
    
    // 根据前后端差异调整配置
    if (isBackend) {
        config.connectionLimit = 50;
        config.idleTimeout = 30000;
        config.connectionTimeout = 2000;
    }
    
    return {
        type: CURRENT_DB_TYPE,
        environment,
        ...config
    };
}

/**
 * 获取当前数据库配置
 * @param {boolean} isBackend - 是否为后端配置
 * @returns {Object} 当前环境的数据库配置
 */
export function getCurrentDatabaseConfig(isBackend = false) {
    const environment = process.env.NODE_ENV || 'development';
    const config = getDatabaseConfig(environment, isBackend);
    
    return config;
}

/**
 * 获取数据库连接字符串
 * @param {boolean} isBackend - 是否为后端配置
 * @returns {string} 数据库连接字符串
 */
export function getConnectionString(isBackend = false) {
    const config = getCurrentDatabaseConfig(isBackend);
    return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

/**
 * 获取 JWT 配置
 * @returns {Object} JWT配置对象
 */
export function getJwtConfig() {
    // JWT_SECRET 已在 middleware/auth.js 中强制检查（安全修复）
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET 环境变量未配置');
    }
    return {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };
}

/**
 * 验证数据库配置
 * @param {Object} config - 要验证的配置对象
 * @throws {Error} 当缺少必需配置时抛出错误
 * @returns {boolean} 验证通过返回true
 */
export function validateDatabaseConfig(config) {
    const requiredFields = ['host', 'port', 'user', 'password', 'database'];
    
    for (const field of requiredFields) {
        if (!config[field]) {
            throw new Error(`缺少必需的数据库配置字段: ${field}`);
        }
    }
    
    // 验证端口格式
    if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
        throw new Error(`无效的数据库端口: ${config.port}`);
    }
    
    return true;
}

/**
 * 验证配置（兼容旧接口）
 * @param {boolean} isBackend - 是否为后端配置
 * @returns {boolean} 验证通过返回true
 */
export function validateConfig(isBackend = false) {
    const config = getCurrentDatabaseConfig(isBackend);
    return validateDatabaseConfig(config);
}