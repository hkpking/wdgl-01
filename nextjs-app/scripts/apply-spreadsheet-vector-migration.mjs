/**
 * 直接通过 Supabase SQL API 执行迁移
 */
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

async function applyFix() {
    console.log('=== 修复 match_spreadsheets RPC ===\n');

    // 先尝试通过 REST API 执行
    const sql = `
CREATE OR REPLACE FUNCTION match_spreadsheets(
    query_embedding TEXT,
    match_threshold FLOAT DEFAULT 0.5,
    match_count INT DEFAULT 5,
    p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    spreadsheet_id UUID,
    chunk_text TEXT,
    similarity FLOAT,
    metadata JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    query_vec vector(384);
BEGIN
    query_vec := query_embedding::vector(384);
    
    RETURN QUERY
    SELECT
        se.id,
        se.spreadsheet_id,
        se.chunk_text,
        1 - (se.embedding::vector(384) <=> query_vec) AS similarity,
        se.metadata
    FROM spreadsheet_embeddings se
    WHERE 
        (p_user_id IS NULL OR (se.metadata->>'user_id')::UUID = p_user_id)
        AND 1 - (se.embedding::vector(384) <=> query_vec) > match_threshold
    ORDER BY se.embedding::vector(384) <=> query_vec
    LIMIT match_count;
END;
$$;
    `;

    console.log('请在 Supabase Dashboard SQL Editor 中执行以下 SQL:\n');
    console.log('═'.repeat(60));
    console.log(sql);
    console.log('═'.repeat(60));
    console.log('\nDashboard URL: https://nwyvgeoeqkoupqwjsghk.supabase.co/project/default/sql');

    // 测试当前 RPC 是否能工作
    console.log('\n--- 测试当前 RPC ---');
    const testEmbedding = Array(384).fill(0.01);
    const { data, error } = await supabase.rpc('match_spreadsheets', {
        query_embedding: JSON.stringify(testEmbedding),
        match_threshold: 0.0,
        match_count: 5
    });

    if (error) {
        console.log('❌ RPC 调用失败:', error.message);
    } else {
        console.log(`✅ RPC 响应: ${data?.length || 0} 条结果`);
        if (data?.length > 0) {
            data.forEach((r, i) => {
                console.log(`   [${i + 1}] ${r.chunk_text?.substring(0, 50)}... (相似度: ${r.similarity})`);
            });
        }
    }
}

applyFix().catch(console.error);
