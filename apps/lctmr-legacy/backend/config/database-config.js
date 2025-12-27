/**
 * 后端数据库配置包
 * 使用共享配置模块
 */

// 导入共享配置模块
const path = require('path');
const sharedConfigPath = path.resolve(__dirname, '../../shared/config.js');

// 使用动态导入来加载ES模块
let sharedConfig;

// 为了兼容CommonJS，我们需要使用Promise来处理ES模块的导入
function getSharedConfig() {
    if (!sharedConfig) {
        throw new Error('共享配置模块尚未加载，请先调用 loadSharedConfig()');
    }
    return sharedConfig;
}

// 加载共享配置模块
exports.loadSharedConfig = async function() {
    if (!sharedConfig) {
        try {
            // 在Windows系统上，需要将绝对路径转换为file:// URL格式
            const fileUrl = require('url').pathToFileURL(sharedConfigPath).href;
            // 对于ES模块，使用动态导入
            sharedConfig = await import(fileUrl);
        } catch (error) {
            console.error('加载共享配置模块失败，使用备用配置:', error.message);
            
            // 备用配置 - 当无法加载共享模块时使用
            sharedConfig = {
                DATABASE_TYPES: {
                    POSTGRESQL: 'postgresql'
                },
                CURRENT_DB_TYPE: 'postgresql',
                getCurrentDatabaseConfig: function() {
                    const environment = process.env.NODE_ENV || 'development';
                    // 根据环境使用不同的默认值（安全修复：生产环境强制要求环境变量）
                    const isDevelopment = environment === 'development';
                    
                    // 生产环境强制要求关键环境变量
                    if (!isDevelopment) {
                        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
                        const missingVars = requiredEnvVars.filter(v => !process.env[v]);
                        if (missingVars.length > 0) {
                            throw new Error(`生产环境缺少必需的环境变量: ${missingVars.join(', ')}`);
                        }
                    } else {
                        // 开发环境使用默认值但发出警告
                        if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === 'Dslr*2025#app') {
                            console.warn('⚠️  警告: 使用默认数据库密码。生产环境必须通过环境变量设置。');
                        }
                    }
                    
                    return {
                        type: 'postgresql',
                        environment,
                        host: process.env.DB_HOST || (isDevelopment ? 'localhost' : null),
                        port: parseInt(process.env.DB_PORT) || 5432,
                        user: process.env.DB_USER || (isDevelopment ? 'web_app' : null),
                        password: process.env.DB_PASSWORD || (isDevelopment ? 'Dslr*2025#app' : null),
                        database: process.env.DB_NAME || (isDevelopment ? 'lctmr_development' : null),
                        ssl: process.env.DB_SSL === 'true' || false,
                        connectionLimit: 50,
                        idleTimeout: 30000,
                        connectionTimeout: 2000
                    };
                },
                getConnectionString: function() {
                    const config = this.getCurrentDatabaseConfig();
                    return `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
                },
                getJwtConfig: function() {
                    // JWT_SECRET 已在 middleware/auth.js 中强制检查，此处不再使用默认值
                    if (!process.env.JWT_SECRET) {
                        throw new Error('JWT_SECRET 环境变量未配置');
                    }
                    return {
                        secret: process.env.JWT_SECRET,
                        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
                    };
                },
                validateConfig: function() {
                    const config = this.getCurrentDatabaseConfig();
                    const requiredFields = ['host', 'port', 'user', 'password', 'database'];
                    
                    for (const field of requiredFields) {
                        if (!config[field]) {
                            throw new Error(`缺少必需的数据库配置字段: ${field}`);
                        }
                    }
                    
                    return true;
                }
            };
        }
    }
    return sharedConfig;
};

// 导出函数（使用Promise包装）
exports.DATABASE_TYPES = {
    POSTGRESQL: 'postgresql'
};

exports.CURRENT_DB_TYPE = exports.DATABASE_TYPES.POSTGRESQL;

exports.getCurrentDatabaseConfig = async function() {
    await exports.loadSharedConfig();
    return getSharedConfig().getCurrentDatabaseConfig(true);
};

exports.getConnectionString = async function() {
    await exports.loadSharedConfig();
    return getSharedConfig().getConnectionString(true);
};

// 获取 API 配置
exports.getApiConfig = function() {
    return {
        useApiServer: true,
        apiBaseUrl: process.env.API_URL || 'http://localhost:3001/api',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:80',
        backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
        isKubernetes: false
    };
};

exports.getJwtConfig = async function() {
    await exports.loadSharedConfig();
    return getSharedConfig().getJwtConfig();
};

exports.validateConfig = async function() {
    await exports.loadSharedConfig();
    return getSharedConfig().validateConfig(true);
};
