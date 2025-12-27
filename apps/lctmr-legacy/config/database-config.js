/**
 * 数据库配置包
 * 使用共享配置模块来统一管理配置
 */

// 动态导入共享配置模块
let sharedConfig = null;
let loadSharedConfigPromise = null;

// 加载共享配置模块的函数
async function loadSharedConfig() {
    try {
        // 避免多次加载
        if (loadSharedConfigPromise) {
            return loadSharedConfigPromise;
        }
        
        // 创建加载Promise
        loadSharedConfigPromise = import('../shared/config.js').then(module => {
            sharedConfig = module;
            return module;
        });
        
        return loadSharedConfigPromise;
    } catch (error) {
        console.error('加载共享配置模块失败:', error.message);
        throw error;
    }
}

// 获取当前数据库配置（异步）
async function getCurrentDatabaseConfig() {
    try {
        // 确保共享配置已加载
        if (!sharedConfig) {
            await loadSharedConfig();
        }
        
        // 获取共享配置
        const config = await sharedConfig.getCurrentDatabaseConfig();
        
        // 保留本地环境的覆盖逻辑
        return {
            ...config,
            // 对于本地开发环境，如果没有设置环境变量，使用localhost作为默认值
            host: process.env.DB_HOST || config.host,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : config.port,
            user: process.env.DB_USER || config.user,
            password: process.env.DB_PASSWORD || config.password,
            database: process.env.DB_NAME || config.database,
            ssl: process.env.DB_SSL ? (process.env.DB_SSL === 'true') : config.ssl
        };
    } catch (error) {
        console.error('获取数据库配置失败:', error.message);
        // 回退到默认配置
        const environment = process.env.NODE_ENV || 'development';
        
        return {
            type: 'postgresql',
            environment,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lctmr',
            ssl: process.env.DB_SSL === 'true' || false,
            connectionLimit: 20,
            idleTimeout: 30000,
            connectionTimeout: 2000
        };
    }
}

// 获取当前数据库配置（同步版本，用于向后兼容）
function getCurrentDatabaseConfigSync() {
    try {
        // 检查共享配置是否已加载
        if (sharedConfig && sharedConfig.getCurrentDatabaseConfigSync) {
            const config = sharedConfig.getCurrentDatabaseConfigSync();
            
            return {
                ...config,
                host: process.env.DB_HOST || config.host,
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : config.port,
                user: process.env.DB_USER || config.user,
                password: process.env.DB_PASSWORD || config.password,
                database: process.env.DB_NAME || config.database,
                ssl: process.env.DB_SSL ? (process.env.DB_SSL === 'true') : config.ssl
            };
        }
        
        // 同步版本回退到本地默认值
        console.warn('⚠️ 警告: 共享配置尚未加载完成，使用本地默认配置');
        
        const environment = process.env.NODE_ENV || 'development';
        return {
            type: 'postgresql',
            environment,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'lctmr',
            ssl: process.env.DB_SSL === 'true' || false,
            connectionLimit: 20,
            idleTimeout: 30000,
            connectionTimeout: 2000
        };
    } catch (error) {
        console.error('获取同步数据库配置失败:', error.message);
        throw error;
    }
}

// 获取数据库连接字符串
function getConnectionString() {
    try {
        const config = getCurrentDatabaseConfigSync();
        return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
    } catch (error) {
        console.error('获取连接字符串失败:', error.message);
        throw error;
    }
}

// 获取 API 配置
function getApiConfig() {
    return {
        useApiServer: true,
        apiBaseUrl: process.env.API_URL || 'http://localhost:3001/api',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5500'
    };
}

// 获取 JWT 配置
async function getJwtConfig() {
    try {
        // 尝试使用共享配置中的JWT配置
        if (!sharedConfig) {
            await loadSharedConfig();
        }
        
        if (sharedConfig && sharedConfig.getJwtConfig) {
            const jwtConfig = await sharedConfig.getJwtConfig();
            return {
                secret: process.env.JWT_SECRET || jwtConfig.secret,
                expiresIn: process.env.JWT_EXPIRES_IN || jwtConfig.expiresIn
            };
        }
        
        // 回退到默认配置
        return {
            secret: process.env.JWT_SECRET || '7YtYAMJUa4LaqChbkV0iN5IMSHvaBCVtBmUktZX3E8JOG0i+4TShH5vXl2HhleUMNITi4thFiYv8UFbdiazkqA==',
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        };
    } catch (error) {
        console.error('获取JWT配置失败:', error.message);
        throw error;
    }
}

// 验证配置
async function validateConfig() {
    try {
        // 使用共享配置的验证函数
        if (!sharedConfig) {
            await loadSharedConfig();
        }
        
        if (sharedConfig && sharedConfig.validateConfig) {
            return await sharedConfig.validateConfig();
        }
        
        // 本地验证逻辑
        const config = await getCurrentDatabaseConfig();
        const requiredFields = ['host', 'port', 'user', 'password', 'database'];
        
        for (const field of requiredFields) {
            if (!config[field]) {
                throw new Error(`缺少必需的数据库配置字段: ${field}`);
            }
        }
        
        return true;
    } catch (error) {
        console.error('验证配置失败:', error.message);
        throw error;
    }
}

// 数据库类型枚举
const DATABASE_TYPES = {
    POSTGRESQL: 'postgresql'
};

const CURRENT_DB_TYPE = DATABASE_TYPES.POSTGRESQL;

module.exports = {
    DATABASE_TYPES,
    CURRENT_DB_TYPE,
    getCurrentDatabaseConfig,
    getCurrentDatabaseConfigSync,
    getConnectionString,
    getApiConfig,
    getJwtConfig,
    validateConfig
};
