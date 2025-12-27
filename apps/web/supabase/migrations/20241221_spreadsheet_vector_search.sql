-- =====================================================
-- 修复表格向量化搜索 - 支持 JSON 字符串格式 (2024-12-21 v2)
-- 问题：向量存储为 JSON 字符串，不是原生 vector 类型
-- 解决：修改 RPC 函数以转换 JSON 字符串
-- =====================================================

-- 确保 pgvector 扩展已启用
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建/更新向量匹配函数 (支持 JSON 字符串输入)
CREATE OR REPLACE FUNCTION match_spreadsheets(
    query_embedding TEXT,  -- JSON 字符串格式，如 "[0.1, 0.2, ...]"
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
    -- 将 JSON 字符串转换为 vector 类型
    query_vec := query_embedding::vector(384);
    
    RETURN QUERY
    SELECT
        se.id,
        se.spreadsheet_id,
        se.chunk_text,
        -- 存储的 embedding 也是 JSON 字符串，需要转换
        1 - (se.embedding::vector(384) <=> query_vec) AS similarity,
        se.metadata
    FROM spreadsheet_embeddings se
    WHERE 
        -- 权限控制：如果提供了 user_id，则只能搜该用户的表格
        (p_user_id IS NULL OR (se.metadata->>'user_id')::UUID = p_user_id)
        -- 相似度阈值
        AND 1 - (se.embedding::vector(384) <=> query_vec) > match_threshold
    ORDER BY se.embedding::vector(384) <=> query_vec
    LIMIT match_count;
END;
$$;

-- 为索引创建准备：由于存储格式问题，需要计算列或重新考虑索引策略
-- 注意：HNSW 索引需要原生 vector 类型列，JSON 字符串无法直接索引
-- 建议后续迁移数据到原生 vector 格式
