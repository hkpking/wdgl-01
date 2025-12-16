/**
 * Supabase pgvector 数据库迁移脚本
 * 执行方式: node scripts/migrate-pgvector.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function runMigration() {
    console.log('🚀 开始执行 pgvector 数据库迁移...\n');

    // Step 1: 启用 pgvector 扩展
    console.log('📦 Step 1: 启用 pgvector 扩展...');
    const { error: extError } = await supabase.rpc('exec_sql', {
        sql: 'CREATE EXTENSION IF NOT EXISTS vector;'
    }).catch(() => ({ error: { message: 'RPC not available' } }));

    // 如果 RPC 不可用，尝试直接查询
    if (extError) {
        console.log('   ⚠️ 使用替代方式检查 vector 扩展...');
        const { data: extCheck } = await supabase
            .from('pg_extension')
            .select('extname')
            .eq('extname', 'vector')
            .single();

        if (!extCheck) {
            console.log('   ❌ pgvector 扩展未安装，请在 Supabase Dashboard 中手动执行:');
            console.log('      CREATE EXTENSION IF NOT EXISTS vector;');
            console.log('   或者在 Database > Extensions 中启用 vector\n');
        } else {
            console.log('   ✅ pgvector 扩展已存在\n');
        }
    } else {
        console.log('   ✅ pgvector 扩展已启用\n');
    }

    // Step 2: 创建 document_embeddings 表
    console.log('📋 Step 2: 创建 document_embeddings 表...');

    // 检查表是否已存在
    const { data: tableExists } = await supabase
        .from('document_embeddings')
        .select('id')
        .limit(1)
        .catch(() => ({ data: null }));

    if (tableExists !== null) {
        console.log('   ✅ document_embeddings 表已存在\n');
    } else {
        // 需要在 Dashboard 中创建表，因为 service role 无法直接执行 DDL
        console.log('   ⚠️ document_embeddings 表不存在');
        console.log('   📝 请在 Supabase Dashboard > SQL Editor 中执行以下 SQL:\n');

        const createTableSQL = `
-- 文档 Embedding 存储表
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

-- 创建 HNSW 索引 (高性能近似最近邻搜索)
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx 
ON document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 启用 RLS
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Users can manage own embeddings" ON document_embeddings
    FOR ALL USING (auth.uid() = user_id);

-- 语义搜索函数
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
        console.log(createTableSQL);
    }

    console.log('\n✅ 迁移脚本执行完成！');
    console.log('📖 如果需要手动操作，请按照上述提示在 Supabase Dashboard 中完成。');
}

runMigration().catch(console.error);
