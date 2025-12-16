/**
 * 批量更新 document_embeddings 的元数据
 * 可以用来修复已存在记录的 title 和 content_hash
 * 
 * 使用方式（在 Supabase SQL 编辑器中运行）:
 */

/*
-- 1. 查看当前元数据情况
SELECT 
    de.id,
    de.document_id,
    d.title as doc_title,
    de.metadata->>'title' as embedding_title,
    de.content_hash
FROM document_embeddings de
JOIN documents d ON de.document_id = d.id
WHERE de.metadata->>'title' = 'Untitled' 
   OR de.metadata->>'title' IS NULL
   OR de.content_hash IS NULL
LIMIT 20;

-- 2. 更新 metadata 中的 title 为文档的实际标题
UPDATE document_embeddings de
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{title}',
    to_jsonb(d.title)
)
FROM documents d
WHERE de.document_id = d.id
  AND (de.metadata->>'title' IS NULL 
       OR de.metadata->>'title' = 'Untitled'
       OR de.metadata->>'title' = '无标题文档');

-- 3. 验证更新结果
SELECT 
    de.id,
    d.title as doc_title,
    de.metadata->>'title' as embedding_title,
    de.chunk_index
FROM document_embeddings de
JOIN documents d ON de.document_id = d.id
ORDER BY de.document_id, de.chunk_index
LIMIT 50;
*/

-- 执行以下 SQL 来批量修复元数据标题
-- 这将把所有 embedding 的 metadata.title 更新为对应文档的实际标题

UPDATE document_embeddings de
SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{title}',
    to_jsonb(d.title)
)
FROM documents d
WHERE de.document_id = d.id;

-- 输出更新的行数
SELECT 'Updated ' || COUNT(*) || ' embeddings with correct titles' as result
FROM document_embeddings;
