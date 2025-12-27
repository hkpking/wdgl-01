/**
 * 初始化开发环境数据库
 * 执行完整的数据库初始化SQL脚本
 */

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initDevDatabase() {
    console.log('🏗️  开始初始化开发环境数据库...');
    
    const pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'web_app',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'lctmr_development',
        ssl: process.env.DB_SSL === 'true'
    });

    try {
        // 1. 先执行基础表结构初始化
        console.log('📝 步骤 1: 初始化基础表结构...');
        const simpleSqlPath = path.join(__dirname, '../sql/init-simple-database.sql');
        const simpleSql = await fs.readFile(simpleSqlPath, 'utf8');
        
        // 执行SQL，忽略已存在的表错误
        const statements = simpleSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith('--') && !s.startsWith('COMMENT'));

        let successCount = 0;
        let skipCount = 0;
        
        for (const statement of statements) {
            if (!statement) continue;
            try {
                await pool.query(statement);
                successCount++;
            } catch (error) {
                // 忽略已存在的表/索引等错误
                if (error.message.includes('already exists') || 
                    error.message.includes('does not exist')) {
                    skipCount++;
                } else if (error.message.includes('permission denied') || 
                           error.message.includes('must be owner')) {
                    console.warn(`⚠️  权限问题（可忽略）: ${error.message.substring(0, 80)}`);
                    skipCount++;
                } else {
                    // 显示真正的错误
                    console.error(`❌ 执行失败: ${error.message.substring(0, 100)}`);
                }
            }
        }
        
        console.log(`✅ 基础表结构: 成功 ${successCount} 条, 跳过 ${skipCount} 条`);

        // 2. 检查users表是否存在
        const tableCheck = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'users'
        `);

        if (tableCheck.rows.length === 0) {
            console.log('❌ users表不存在，尝试手动创建...');
            await pool.query(`
                CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
                CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            `);
            
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
            `);
            
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.profiles (
                    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
                    role VARCHAR(50) DEFAULT 'user',
                    full_name TEXT,
                    faction TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `);
            
            await pool.query(`
                CREATE TABLE IF NOT EXISTS public.scores (
                    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
                    username TEXT,
                    points INTEGER DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
            `);
            
            console.log('✅ 核心表创建成功');
        }

        // 3. 检查是否有用户数据
        const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`📊 当前用户数量: ${userCount.rows[0].count}`);

        // 4. 如果没有用户，可以从生产环境复制或创建测试用户
        if (parseInt(userCount.rows[0].count) === 0) {
            console.log('📝 开发数据库为空，建议：');
            console.log('   1. 从生产数据库复制用户数据');
            console.log('   2. 或通过前端注册新用户');
        }

        // 5. 初始化对话学习相关表
        console.log('📝 步骤 2: 初始化对话学习表结构...');
        const { initConversationLearning } = require('./init-database');
        await initConversationLearning();
        
        console.log('✅ 开发环境数据库初始化完成！');
        
    } catch (error) {
        console.error('❌ 初始化失败:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

// 执行初始化
if (require.main === module) {
    initDevDatabase()
        .then(() => {
            console.log('🎊 开发数据库初始化完成');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 初始化失败:', error);
            process.exit(1);
        });
}

module.exports = { initDevDatabase };


