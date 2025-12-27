-- =====================================================
-- 添加 content_hash 列支持增量索引
-- =====================================================

-- 添加 content_hash 列（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'document_embeddings' 
        AND column_name = 'content_hash'
    ) THEN
        ALTER TABLE document_embeddings 
        ADD COLUMN content_hash VARCHAR(32);
        
        -- 创建索引以加速哈希查询
        CREATE INDEX IF NOT EXISTS document_embeddings_hash_idx 
        ON document_embeddings(document_id, content_hash);
        
        RAISE NOTICE 'Added content_hash column to document_embeddings';
    ELSE
        RAISE NOTICE 'content_hash column already exists';
    END IF;
END $$;
