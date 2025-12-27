/**
 * @file init-database.js
 * @description 数据库初始化脚本执行器
 * @version 1.0.0
 * @author LCTMR Team
 */

const fs = require('fs').promises;
const path = require('path');
const { getPool, connectDatabase } = require('../config/database');

/**
 * 执行SQL文件
 * @param {string} filePath SQL文件路径
 */
async function executeSqlFile(filePath) {
    try {
        console.log(`📝 执行SQL文件: ${filePath}`);
        
        // 读取SQL文件
        const sqlContent = await fs.readFile(filePath, 'utf8');
        
        // 分割SQL语句（简单的分割，可能需要更复杂的解析器）
        const statements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        const pool = getPool();
        
        // 执行每个SQL语句
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    await pool.query(statement);
                    console.log(`✅ 执行语句 ${i + 1}/${statements.length} 成功`);
                } catch (error) {
                    console.error(`❌ 执行语句 ${i + 1} 失败:`, error.message);
                    console.log('失败的语句:', statement.substring(0, 100) + '...');
                    // 继续执行其他语句
                }
            }
        }
        
        console.log(`🎉 SQL文件执行完成: ${filePath}`);
        
    } catch (error) {
        console.error(`❌ 执行SQL文件失败: ${filePath}`, error);
        throw error;
    }
}

/**
 * 检查表是否存在
 * @param {string} tableName 表名
 * @returns {Promise<boolean>} 表是否存在
 */
async function tableExists(tableName) {
    try {
        const pool = getPool();
        const result = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = $1
            );
        `, [tableName]);
        
        return result.rows[0].exists;
    } catch (error) {
        console.error(`检查表 ${tableName} 是否存在时出错:`, error);
        return false;
    }
}

/**
 * 初始化对话学习相关数据库结构
 */
async function initConversationLearning() {
    console.log('🚀 开始初始化对话学习数据库结构...');
    
    try {
        // 检查主要表是否存在
        const progressTableExists = await tableExists('conversation_progress');
        const pointsHistoryTableExists = await tableExists('user_points_history');
        
        if (progressTableExists && pointsHistoryTableExists) {
            console.log('✅ 对话学习相关表已存在，跳过初始化');
            return;
        }
        
        // 执行初始化脚本
        const sqlFilePath = path.join(__dirname, '../sql/init-conversation-learning.sql');
        await executeSqlFile(sqlFilePath);
        
        console.log('🎉 对话学习数据库结构初始化完成！');
        
    } catch (error) {
        console.error('❌ 对话学习数据库初始化失败:', error);
        throw error;
    }
}

/**
 * 检查数据库连接
 */
async function checkDatabaseConnection() {
    try {
        const pool = getPool();
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('🔗 数据库连接正常，当前时间:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ 数据库连接失败:', error);
        return false;
    }
}

/**
 * 主初始化函数
 */
async function initDatabase() {
    console.log('🏗️  开始数据库初始化...');
    
    try {
        // 先建立数据库连接
        await connectDatabase();
        
        // 检查数据库连接
        const isConnected = await checkDatabaseConnection();
        if (!isConnected) {
            throw new Error('数据库连接失败');
        }
        
        // 初始化对话学习相关结构
        await initConversationLearning();
        
        console.log('✅ 数据库初始化完成！');
        
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本，则执行初始化
if (require.main === module) {
    initDatabase().then(() => {
        console.log('🎊 数据库初始化脚本执行完毕');
        process.exit(0);
    }).catch((error) => {
        console.error('💥 数据库初始化脚本执行失败:', error);
        process.exit(1);
    });
}

module.exports = {
    initDatabase,
    initConversationLearning,
    checkDatabaseConnection,
    executeSqlFile,
    tableExists
};