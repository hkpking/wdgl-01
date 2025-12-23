/**
 * 数据库结构诊断脚本
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.error('缺少 SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('📊 Supabase 数据库诊断\n');

    const knownTables = ['documents', 'spreadsheets', 'comments', 'versions',
        'document_chunks', 'spreadsheet_embeddings', 'teams', 'knowledge_bases', 'folders'];

    for (const table of knownTables) {
        const { error } = await supabase.from(table).select('id').limit(1);
        if (!error) {
            const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
            console.log(`✅ ${table} (${count || 0} 条)`);
        } else if (error.code === '42P01') {
            console.log(`❌ ${table} (不存在)`);
        } else {
            console.log(`⚠️ ${table}: ${error.message}`);
        }
    }

    // 检查 comments 表结构
    console.log('\n📝 comments 表详情:');
    const { data, error } = await supabase.from('comments').select('*').limit(1);
    if (error) {
        console.log(`  状态: ${error.code === '42P01' ? '不存在' : error.message}`);
    } else {
        console.log(`  状态: 存在`);
        if (data?.[0]) console.log(`  字段: ${Object.keys(data[0]).join(', ')}`);
    }
}

main().catch(console.error);
