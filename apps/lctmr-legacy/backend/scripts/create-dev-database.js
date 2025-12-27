/**
 * 创建开发数据库脚本
 * 通过现有数据库连接创建开发数据库
 */

const { Pool } = require('pg');
const path = require('path');

// 从环境变量或配置文件读取数据库配置
// 优先读取当前运行环境的配置
require('dotenv').config({ path: path.join(__dirname, '../../env.production') });

async function createDevDatabase() {
    console.log('📊 开始创建开发数据库...');
    console.log('🔍 使用数据库配置:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   User: ${process.env.DB_USER || 'web_app'}`);
    console.log('');
    
    // 连接到默认数据库（postgres）来创建新数据库
    const adminPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'web_app',
        password: process.env.DB_PASSWORD,
        database: 'postgres', // 连接到 postgres 数据库来创建新数据库
        ssl: process.env.DB_SSL === 'true'
    });

    try {
        // 检查数据库是否已存在
        const checkResult = await adminPool.query(
            "SELECT 1 FROM pg_database WHERE datname = 'lctmr_development'"
        );

        if (checkResult.rows.length > 0) {
            console.log('✅ 数据库 lctmr_development 已存在');
        } else {
            // 创建数据库
            await adminPool.query('CREATE DATABASE lctmr_development');
            console.log('✅ 数据库 lctmr_development 创建成功');
        }

        // 授予权限
        try {
            await adminPool.query(
                "GRANT ALL PRIVILEGES ON DATABASE lctmr_development TO web_app"
            );
            console.log('✅ 权限授予成功');
        } catch (permError) {
            console.warn('⚠️  权限授予可能失败（如果已存在权限则正常）:', permError.message);
        }

        // 测试连接到新创建的数据库
        const testPool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            user: process.env.DB_USER || 'web_app',
            password: process.env.DB_PASSWORD,
            database: 'lctmr_development',
            ssl: process.env.DB_SSL === 'true'
        });

        try {
            const testResult = await testPool.query('SELECT version()');
            console.log('✅ 数据库连接测试成功');
            console.log('📝 PostgreSQL 版本:', testResult.rows[0].version);
            await testPool.end();
        } catch (testError) {
            console.warn('⚠️  数据库连接测试失败:', testError.message);
        }

        await adminPool.end();
        console.log('🎉 开发数据库创建完成！');
        console.log('');
        console.log('📋 下一步：');
        console.log('   1. 如果需要初始化表结构，可以运行：');
        console.log('      cd backend && NODE_ENV=development node scripts/init-database.js');
        console.log('   2. 启动开发环境：');
        console.log('      ./scripts/deploy.sh development start');

    } catch (error) {
        console.error('❌ 创建数据库失败:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   无法连接到数据库服务器，请检查：');
            console.error('   1. 数据库服务器是否运行');
            console.error('   2. 网络连接是否正常');
            console.error('   3. 防火墙设置');
        } else if (error.code === '3D000') {
            console.error('   数据库不存在或权限不足');
        } else if (error.code === '28P01') {
            console.error('   数据库认证失败，请检查用户名和密码');
        }
        
        await adminPool.end();
        process.exit(1);
    }
}

// 执行创建
createDevDatabase();

