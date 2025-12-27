-- =====================================================
-- 更新统一内容视图添加 content_type 字段
-- 2024-12-24
-- =====================================================

-- 1. 添加 content_type 列到 documents 表（用于区分文档类型：html、flowchart 等）
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'html';

-- 2. 删除旧视图并重建（因为列数变化需要完全重建）
DROP VIEW IF EXISTS public.all_content_items;

-- 3. 创建新视图包含 content_type 字段
CREATE VIEW public.all_content_items
WITH (security_invoker = true)
AS
SELECT
    id,
    'document'::TEXT AS type,
    title,
    folder_id,
    team_id,
    knowledge_base_id,
    user_id,
    status,
    content_type,
    created_at,
    updated_at
FROM public.documents

UNION ALL

SELECT
    id,
    'spreadsheet'::TEXT AS type,
    title,
    folder_id,
    team_id,
    knowledge_base_id,
    user_id,
    status,
    NULL::TEXT AS content_type,
    created_at,
    updated_at
FROM public.spreadsheets;

COMMENT ON VIEW public.all_content_items IS '统一内容视图：合并 documents 和 spreadsheets，包含 content_type 用于区分文档子类型（如 flowchart）';
