-- =====================================================
-- 本地 Embedding 模型迁移 (384 维度)
-- 模型: Xenova/all-MiniLM-L6-v2
-- =====================================================

-- 1. 启用 pgvector (如果尚未启用)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 删除旧表 (如果存在) - 因为维度变了，需要完全重建
DROP TABLE IF EXISTS document_embeddings CASCADE;

-- 3. 创建新表 (384 维度)
CREATE TABLE document_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding vector(384),                  -- ⬅️ 改为 384 维度
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_doc_chunk UNIQUE(document_id, chunk_index)
);

-- 4. 创建索引
CREATE INDEX document_embeddings_user_idx ON document_embeddings(user_id);
CREATE INDEX document_embeddings_doc_idx ON document_embeddings(document_id);

-- 5. 创建向量索引 (IVFFlat 适合中小数据量，这里用 HNSW 也行)
CREATE INDEX document_embeddings_embedding_idx 
ON document_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 6. 启用 RLS
ALTER TABLE document_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own embeddings" ON document_embeddings
    FOR ALL USING (auth.uid() = user_id);

-- 7. 重建搜索函数
DROP FUNCTION IF EXISTS match_documents;

CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(384),            -- ⬅️ 改为 384 维度
    match_threshold FLOAT DEFAULT 0.5,      -- 适当调低阈值，不同模型对距离敏感度不同
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
