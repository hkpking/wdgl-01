/**
 * 执行数据库迁移 - 升级表结构
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 由于 Supabase JS 客户端不支持执行原始 SQL，
// 我们需要使用 REST API 的 rpc 功能或逐个执行 ALTER 语句

async function executeAlterTable(table, column, type, defaultVal = null) {
    // 使用 select 测试字段是否存在
    const { error: testError } = await supabase.from(table).select(column).limit(1);

    if (testError && testError.message.includes('does not exist')) {
        console.log(`  添加 ${table}.${column}...`);
        // 由于 JS 客户端无法执行 ALTER TABLE，输出需要手动执行的 SQL
        return `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${type}${defaultVal ? ` DEFAULT ${defaultVal}` : ''};`;
    } else {
        console.log(`  ✓ ${table}.${column} 已存在`);
        return null;
    }
}

async function main() {
    console.log('🔧 检查并生成迁移 SQL\n');

    const alterStatements = [];

    // comments 表
    const commentFields = [
        ['target_type', 'VARCHAR(20)'],
        ['target_id', 'UUID'],
        ['cell_row', 'INT'],
        ['cell_col', 'INT'],
        ['page_number', 'INT'],
        ['position_x', 'FLOAT'],
        ['position_y', 'FLOAT'],
        ['start_offset', 'INT'],
        ['end_offset', 'INT'],
        ['author_uid', 'VARCHAR(100)'],
        ['author_name', 'VARCHAR(200)'],
        ['author_avatar', 'TEXT'],
        ['mentions', "TEXT[]", "'{}'"],
        ['replies', 'JSONB', "'[]'::jsonb"],
    ];

    console.log('📝 comments 表:');
    for (const [col, type, def] of commentFields) {
        const sql = await executeAlterTable('comments', col, type, def);
        if (sql) alterStatements.push(sql);
    }

    // versions 表
    const versionFields = [
        ['target_type', 'VARCHAR(20)'],
        ['target_id', 'UUID'],
        ['created_by_uid', 'VARCHAR(100)'],
        ['created_by_name', 'VARCHAR(200)'],
        ['metadata', 'JSONB', "'{}'::jsonb"],
    ];

    console.log('\n📜 versions 表:');
    for (const [col, type, def] of versionFields) {
        const sql = await executeAlterTable('versions', col, type, def);
        if (sql) alterStatements.push(sql);
    }

    if (alterStatements.length > 0) {
        console.log('\n' + '='.repeat(60));
        console.log('⚠️ 请在 Supabase Dashboard SQL Editor 中执行以下语句:');
        console.log('='.repeat(60) + '\n');
        console.log(alterStatements.join('\n'));
        console.log('\n' + '='.repeat(60));
    } else {
        console.log('\n✅ 所有字段都已存在，无需迁移！');
    }
}

main().catch(console.error);
