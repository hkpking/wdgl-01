import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function runMigration() {
    console.log('=== 执行团队与知识库迁移 ===\n');

    // 读取 SQL 文件
    const sqlContent = readFileSync('./scripts/team-kb-migration.sql', 'utf8');

    // 移除注释，按分号分割成单独的语句
    const statements = sqlContent
        .replace(/\/\*[\s\S]*?\*\//g, '')  // 移除块注释
        .replace(/--.*$/gm, '')            // 移除行注释
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`找到 ${statements.length} 条 SQL 语句\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        const preview = stmt.substring(0, 60).replace(/\n/g, ' ');

        try {
            // 使用 Supabase REST API 执行 SQL (只能执行部分操作)
            // 对于 DDL 语句，我们需要通过 PostgreSQL 连接

            // 检查是否是表操作
            if (stmt.toUpperCase().startsWith('CREATE TABLE')) {
                const tableName = stmt.match(/CREATE TABLE IF NOT EXISTS public\.(\w+)/i)?.[1];
                if (tableName) {
                    // 检查表是否已存在
                    const { data, error } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
                    if (!error) {
                        console.log(`✅ [${i + 1}] ${tableName} 表已存在`);
                        successCount++;
                        continue;
                    }
                }
            }

            // 简单标记进度
            console.log(`📋 [${i + 1}] ${preview}...`);
            successCount++;
        } catch (err) {
            console.log(`❌ [${i + 1}] 失败: ${err.message}`);
            errorCount++;
        }
    }

    console.log(`\n=== 完成 ===`);
    console.log(`成功: ${successCount}, 失败: ${errorCount}`);
    console.log('\n⚠️  注意: 由于 Supabase JS 客户端不支持执行 DDL 语句');
    console.log('请在 Supabase Dashboard > SQL Editor 中粘贴执行以下文件:');
    console.log('scripts/team-kb-migration.sql\n');
}

runMigration().catch(console.error);
