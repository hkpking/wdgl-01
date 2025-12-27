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

async function checkTableColumns() {
    console.log('=== 检查团队/知识库相关表字段 ===\n');

    const tables = ['teams', 'team_members', 'knowledge_bases', 'departments', 'department_members'];

    for (const tableName of tables) {
        try {
            // 尝试插入一条空记录来触发错误获取字段信息
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(0);

            // 获取表结构通过 REST API
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?limit=0`, {
                headers: {
                    'apikey': SUPABASE_SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                }
            });

            if (response.ok) {
                // 尝试插入一条测试记录获取字段验证错误
                const testInsert = await supabase.from(tableName).insert({
                    _test_field: true  // 故意用无效字段触发错误
                });

                if (testInsert.error) {
                    console.log(`📋 ${tableName}:`, testInsert.error.message);
                }
            } else {
                console.log(`❌ ${tableName}: 表不存在`);
            }
        } catch (e) {
            console.log(`⚠️  ${tableName}: ${e.message}`);
        }
    }

    // 尝试直接查询获取字段
    console.log('\n=== 尝试获取表字段 ===\n');

    const { data: teamsTest } = await supabase.from('teams').select('*').limit(1);
    const { data: kbTest } = await supabase.from('knowledge_bases').select('*').limit(1);
    const { data: deptTest } = await supabase.from('departments').select('*').limit(1);
    const { data: tmTest } = await supabase.from('team_members').select('*').limit(1);

    // 打印请求信息，通过接口获取结构
    console.log('teams 返回:', teamsTest);
    console.log('knowledge_bases 返回:', kbTest);
    console.log('departments 返回:', deptTest);
    console.log('team_members 返回:', tmTest);
}

checkTableColumns().catch(console.error);
