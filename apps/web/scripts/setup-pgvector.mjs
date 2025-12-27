/**
 * 使用 Supabase SQL API 执行数据库迁移
 * 执行: node --env-file=.env.local scripts/setup-pgvector.mjs
 */

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
    console.error('❌ 错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    process.exit(1);
}

// SQL 迁移语句
const MIGRATION_SQL = `
-- 1. 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 创建 document_embeddings 表 (如果不存在)
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_doc_chunk UNIQUE(document_id, chunk_index)
);

-- 3. 创建索引
CREATE INDEX IF NOT EXISTS document_embeddings_user_idx ON document_embeddings(user_id);
CREATE INDEX IF NOT EXISTS document_embeddings_doc_idx ON document_embeddings(document_id);
`;

const VECTOR_INDEX_SQL = `
-- 创建 HNSW 向量索引 (需要 pgvector 扩展)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'document_embeddings_embedding_idx'
    ) THEN
        CREATE INDEX document_embeddings_embedding_idx 
        ON document_embeddings 
        USING hnsw (embedding vector_cosine_ops)
        WITH (m = 16, ef_construction = 64);
    END IF;
END $$;
`;

const RLS_SQL = `
-- 启用 RLS
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- 删除已存在的策略 (如果有)
DROP POLICY IF EXISTS "Users can manage own embeddings" ON document_embeddings;

-- 创建 RLS 策略
CREATE POLICY "Users can manage own embeddings" ON document_embeddings
    FOR ALL USING (auth.uid() = user_id);
`;

const SEARCH_FUNCTION_SQL = `
-- 创建语义搜索函数
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    chunk_text TEXT,
    similarity FLOAT,
    metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        de.id,
        de.document_id,
        de.chunk_text,
        1 - (de.embedding <=> query_embedding) AS similarity,
        de.metadata
    FROM document_embeddings de
    WHERE 
        (p_user_id IS NULL OR de.user_id = p_user_id)
        AND 1 - (de.embedding <=> query_embedding) > match_threshold
    ORDER BY de.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
`;

async function executeSql(sql, description) {
    console.log(`\n📝 ${description}...`);

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            },
            body: JSON.stringify({ sql })
        });

        if (response.ok) {
            console.log(`   ✅ 成功`);
            return true;
        } else {
            const error = await response.text();
            console.log(`   ⚠️ RPC 方式不可用: ${error}`);
            return false;
        }
    } catch (error) {
        console.log(`   ⚠️ 执行失败: ${error.message}`);
        return false;
    }
}

async function checkTableExists(tableName) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${tableName}?select=id&limit=0`,
            {
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                }
            }
        );
        return response.ok;
    } catch {
        return false;
    }
}

async function runMigration() {
    console.log('🚀 Supabase pgvector 数据库迁移\n');
    console.log('='.repeat(50));

    // 检查 document_embeddings 表是否存在
    const tableExists = await checkTableExists('document_embeddings');

    if (tableExists) {
        console.log('\n✅ document_embeddings 表已存在!');
        console.log('   数据库已经配置完成。\n');
        return;
    }

    console.log('\n⚠️ document_embeddings 表不存在');
    console.log('\n由于 Supabase REST API 不支持直接执行 DDL，');
    console.log('请复制以下 SQL 到 Supabase Dashboard > SQL Editor 执行:\n');
    console.log('='.repeat(50));
    console.log(`
${MIGRATION_SQL}

${VECTOR_INDEX_SQL}

${RLS_SQL}

${SEARCH_FUNCTION_SQL}
`);
    console.log('='.repeat(50));
    console.log('\n📋 操作步骤:');
    console.log('1. 打开 https://supabase.com/dashboard/project/nwyvgeoeqkoupqwjsghk/sql');
    console.log('2. 复制上述 SQL 语句');
    console.log('3. 点击 Run 执行');
    console.log('4. 重新运行此脚本验证');
}

runMigration().catch(console.error);
