/**
 * 阿里云 PostgreSQL 数据库检查脚本
 * 检查生产环境和开发环境的用户数据
 */

import pg from 'pg';
const { Client } = pg;

// 数据库配置
const DB_CONFIG = {
    host: '120.79.181.206',
    port: 5432,
    user: 'web_app',
    password: 'Dslr*2025#app',
};

// 要检查的数据库
const DATABASES = ['lctmr_production', 'lctmr_development'];

// 要检查的表
const TABLES_TO_CHECK = [
    'users',
    'profiles',
    'scores',
    'user_progress',
    'categories',
    'chapters',
    'sections',
    'blocks',
    'achievements',
    'user_achievements',
    'challenges',
    'factions'
];

async function checkDatabase(dbName) {
    console.log('\n' + '='.repeat(60));
    console.log(`📊 检查数据库: ${dbName}`);
    console.log('='.repeat(60));

    const client = new Client({
        ...DB_CONFIG,
        database: dbName,
    });

    try {
        await client.connect();
        console.log(`✅ 成功连接到 ${dbName}`);

        // 获取所有表
        const tablesResult = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `);

        console.log(`\n📋 数据库中的表 (共 ${tablesResult.rows.length} 个):`);
        tablesResult.rows.forEach(row => console.log(`   - ${row.table_name}`));

        // 检查每个表的数据量
        console.log(`\n📈 各表数据量统计:`);
        console.log('-'.repeat(40));

        for (const table of TABLES_TO_CHECK) {
            try {
                const countResult = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
                const count = parseInt(countResult.rows[0].count);
                const status = count > 0 ? '✅' : '⚠️';
                console.log(`${status} ${table.padEnd(20)}: ${count} 条记录`);

                // 如果是用户相关表且有数据，显示更多详情
                if ((table === 'users' || table === 'profiles' || table === 'scores') && count > 0 && count <= 20) {
                    const sampleResult = await client.query(`SELECT * FROM "${table}" LIMIT 5`);
                    console.log(`   └─ 示例数据:`);
                    sampleResult.rows.forEach((row, idx) => {
                        const info = row.username || row.email || row.user_id || row.id;
                        console.log(`      ${idx + 1}. ${info}`);
                    });
                }
            } catch (err) {
                if (err.message.includes('does not exist')) {
                    console.log(`❌ ${table.padEnd(20)}: 表不存在`);
                } else {
                    console.log(`❌ ${table.padEnd(20)}: ${err.message}`);
                }
            }
        }

        // 统计总用户数
        console.log('\n' + '-'.repeat(40));
        try {
            // 尝试不同的用户表名
            let userCount = 0;
            for (const userTable of ['users', 'profiles', 'scores']) {
                try {
                    const result = await client.query(`SELECT COUNT(*) as count FROM "${userTable}"`);
                    userCount = Math.max(userCount, parseInt(result.rows[0].count));
                } catch (e) { /* 忽略不存在的表 */ }
            }
            console.log(`📊 用户总数: ${userCount}`);
        } catch (err) {
            console.log(`❌ 无法统计用户数: ${err.message}`);
        }

    } catch (err) {
        console.log(`❌ 连接失败: ${err.message}`);
    } finally {
        await client.end();
    }
}

async function main() {
    console.log('🔍 阿里云 PostgreSQL 数据库检查');
    console.log(`📍 服务器: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    console.log(`👤 用户: ${DB_CONFIG.user}`);

    for (const dbName of DATABASES) {
        await checkDatabase(dbName);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ 检查完成');
    console.log('='.repeat(60));
}

main().catch(console.error);
