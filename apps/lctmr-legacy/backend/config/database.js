/**
 * 数据库配置和连接管理 - 远程数据库专用
 */

const { Pool } = require('pg');
const { getCurrentDatabaseConfig, validateConfig } = require('../config/database-config');

// 缓存配置对象，避免多次加载
let cachedConfig = null;
let pool = null;

// 获取数据库配置的函数 - 专注于远程数据库配置
async function getDatabaseConfig() {
    try {
        // 确保加载共享配置，不使用本地回退
        if (!cachedConfig) {
            cachedConfig = await getCurrentDatabaseConfig();
            await validateConfig();
        }
        
        return {
            host: cachedConfig.host,
            port: cachedConfig.port,
            user: cachedConfig.user,
            password: cachedConfig.password,
            database: cachedConfig.database,
            ssl: cachedConfig.ssl ? { rejectUnauthorized: false } : false,
            max: cachedConfig.connectionLimit || 20,
            idleTimeoutMillis: cachedConfig.idleTimeout || 30000,
            // 增加远程数据库连接超时时间到30秒，避免连接超时错误
            connectionTimeoutMillis: cachedConfig.connectionTimeout || 30000,
        };
    } catch (error) {
        console.error('❌ 数据库配置错误:', error.message);
        throw error;
    }
}

/**
 * 连接数据库
 */
async function connectDatabase() {
    try {
        // 异步获取配置
        const dbConfig = await getDatabaseConfig();
        
        // 使用缓存的配置对象获取额外信息
        const config = cachedConfig;
        
        console.log(`📊 数据库配置: ${config.type} (${config.environment})`);
        console.log(`🔗 连接: ${config.user}@${config.host}:${config.port}/${config.database}`);
        
        pool = new Pool(dbConfig);
        
        // 测试连接
        const client = await pool.connect();
        const result = await client.query('SELECT version()');
        client.release();
        
        console.log('✅ 数据库连接成功');
        console.log(`📊 PostgreSQL版本: ${result.rows[0].version.split(' ')[0]}`);
        
        return pool;
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        throw error;
    }
}

/**
 * 初始化数据库配置
 */
async function initializeDatabaseConfig() {
    try {
        if (!cachedConfig) {
            cachedConfig = await getCurrentDatabaseConfig();
            await validateConfig();
            console.log('✅ 数据库配置已初始化');
        }
    } catch (error) {
        console.error('❌ 数据库配置初始化失败:', error.message);
        throw error; // 远程数据库连接必须成功，否则抛出错误
    }
}

/**
 * 获取数据库连接池
 */
function getPool() {
    if (!pool) {
        throw new Error('数据库未连接，请先调用 connectDatabase()');
    }
    return pool;
}

/**
 * 执行查询
 */
async function query(text, params = []) {
    const pool = getPool();
    const start = Date.now();
    
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`🔍 SQL查询 (${duration}ms):`, text.substring(0, 100) + '...');
        }
        
        return result;
    } catch (error) {
        console.error('❌ 数据库查询错误:', error.message);
        throw error;
    }
}

/**
 * 获取客户端（用于事务）
 */
async function getClient() {
    const pool = getPool();
    return await pool.connect();
}

/**
 * 关闭数据库连接
 */
async function closeDatabase() {
    if (pool) {
        await pool.end();
        pool = null;
        console.log('🔌 数据库连接已关闭');
    }
}

module.exports = {
    connectDatabase,
    getPool,
    query,
    getClient,
    closeDatabase,
    initializeDatabaseConfig,
    getDatabaseConfig
};
