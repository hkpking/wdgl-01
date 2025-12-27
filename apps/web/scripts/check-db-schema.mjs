import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function queryDatabaseSchema() {
    console.log('=== 使用 information_schema 查询数据库表 ===\n');

    // 使用 Supabase 的 sql 功能执行原生 SQL
    const { data, error } = await supabase.rpc('get_tables_info');

    if (error) {
        console.log('RPC get_tables_info 不可用，尝试其他方法...\n');

        // 尝试通过 PostgREST 查询每个可能的表
        const tablesToCheck = [
            'profiles', 'folders', 'documents', 'versions', 'comments',
            'document_chunks', 'teams', 'team_members', 'knowledge_bases',
            'departments', 'department_members', 'kb_folders', 'kb_documents'
        ];

        console.log('检查表是否存在（通过 PostgREST）:\n');

        for (const table of tablesToCheck) {
            try {
                // 使用 HEAD 请求检查表是否存在
                const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=count`, {
                    method: 'HEAD',
                    headers: {
                        'apikey': SUPABASE_SERVICE_ROLE_KEY,
                        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    }
                });

                if (response.ok) {
                    // 获取记录数
                    const countRes = await supabase.from(table).select('*', { count: 'exact', head: true });
                    console.log(`✅ ${table} - 存在 (约 ${countRes.count ?? '?'} 条)`);
                } else if (response.status === 404) {
                    console.log(`❌ ${table} - 不存在`);
                } else {
                    console.log(`⚠️  ${table} - HTTP ${response.status}`);
                }
            } catch (e) {
                console.log(`❌ ${table} - 错误: ${e.message}`);
            }
        }
    } else {
        console.log('表信息:', data);
    }

    // 检查 Supabase 配置
    console.log('\n=== Supabase 连接信息 ===');
    console.log('URL:', SUPABASE_URL);
    console.log('Key (前10位):', SUPABASE_SERVICE_ROLE_KEY.substring(0, 10) + '...');
}

queryDatabaseSchema().catch(console.error);
