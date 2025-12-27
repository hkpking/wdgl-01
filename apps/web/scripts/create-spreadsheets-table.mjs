/**
 * 执行 spreadsheets 表创建的 migration 脚本
 * 使用 Supabase Management API 的 SQL 执行功能
 */
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取 .env.local 文件
const envPath = join(__dirname, '..', '.env.local');
try {
    const envContent = readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
} catch (e) {
    console.log('无法读取 .env.local，使用系统环境变量');
}

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    process.exit(1);
}

console.log('=== 创建 spreadsheets 表 ===\n');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Service Key (前20位):', SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...');

// 使用 Supabase Data API 检查表是否存在
async function checkTableExists() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/spreadsheets?select=id&limit=1`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
    });

    if (response.ok) {
        console.log('\n✅ spreadsheets 表已存在!');
        return true;
    }

    const text = await response.text();
    console.log('\n表检查结果:', response.status, text.substring(0, 200));
    return false;
}

// 尝试使用 Supabase Management API 执行 SQL
async function executeSQLViaMgmtAPI(sql) {
    // Supabase Management API 需要项目 ref 和 access token
    // 这里我们使用 PostgREST 的一个变通方法

    // 首先尝试通过 rpc 调用（如果数据库有 exec_sql 函数）
    const rpcResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql_query: sql }),
    });

    if (rpcResponse.ok) {
        return { success: true };
    }

    return { success: false, error: await rpcResponse.text() };
}

async function main() {
    // 1. 检查表是否存在
    const exists = await checkTableExists();
    if (exists) {
        console.log('\n表格创建无需执行，继续后续开发。');
        return;
    }

    // 2. 尝试通过 RPC 执行 SQL
    console.log('\n尝试通过 RPC 执行 SQL...');
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.spreadsheets (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            title TEXT NOT NULL DEFAULT '无标题表格',
            data JSONB DEFAULT '[]',
            folder_id UUID,
            team_id UUID,
            knowledge_base_id UUID,
            user_id UUID NOT NULL,
            status TEXT DEFAULT 'draft',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    const result = await executeSQLViaMgmtAPI(createTableSQL);

    if (result.success) {
        console.log('✅ 表创建成功!');
    } else {
        console.log('\n❌ RPC 执行失败:', result.error?.substring(0, 200));
        console.log('\n=== 请手动执行以下 SQL ===\n');
        console.log(`
-- 在 Supabase Dashboard > SQL Editor 中执行:

CREATE TABLE IF NOT EXISTS public.spreadsheets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '无标题表格',
    data JSONB DEFAULT '[]',
    folder_id UUID,
    team_id UUID,
    knowledge_base_id UUID,
    user_id UUID NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_spreadsheets_user ON public.spreadsheets(user_id);
CREATE INDEX IF NOT EXISTS idx_spreadsheets_folder ON public.spreadsheets(folder_id);

ALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own spreadsheets" ON public.spreadsheets
    FOR ALL USING (auth.uid() = user_id);
        `);
    }
}

main().catch(console.error);
