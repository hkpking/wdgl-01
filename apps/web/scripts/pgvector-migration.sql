-- =====================================================
-- Supabase pgvector 知识库数据库迁移
-- 请在 Supabase Dashboard > SQL Editor 中执行此脚本
-- URL: https://supabase.com/dashboard/project/nwyvgeoeqkoupqwjsghk/sql/new
-- =====================================================

-- 第一步：启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 第二步：创建 document_embeddings 表
CREATE TABLE IF NOT EXISTS document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    chunk_index INTEGER NOT NULL,           -- 分块索引
    chunk_text TEXT NOT NULL,               -- 分块原文
    embedding vector(1536),                 -- OpenAI text-embedding-3-small 维度
    metadata JSONB DEFAULT '{}',            -- 元数据
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_doc_chunk UNIQUE(document_id, chunk_index)
);

-- 第三步：创建常规索引
CREATE INDEX IF NOT EXISTS document_embeddings_user_idx ON document_embeddings(user_id);
CREATE INDEX IF NOT EXISTS document_embeddings_doc_idx ON document_embeddings(document_id);

-- 第四步：创建 HNSW 向量索引 (高性能近似最近邻搜索)
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

-- 第五步：启用 RLS
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

-- 第六步：创建 RLS 策略
DROP POLICY IF EXISTS "Users can manage own embeddings" ON document_embeddings;
CREATE POLICY "Users can manage own embeddings" ON document_embeddings
    FOR ALL USING (auth.uid() = user_id);

-- 第七步：创建语义搜索函数
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

-- =====================================================
-- 迁移完成！执行后应该看到 "Success. No rows returned"
-- =====================================================
