-- =====================================================
-- 统一内容视图 (Unified Content View)
-- 合并 documents 和 spreadsheets 表，便于跨类型搜索、排序
-- =====================================================

-- 1. 创建统一内容视图
-- 使用 SECURITY INVOKER 确保 RLS 策略在查询时按调用者身份执行
CREATE OR REPLACE VIEW public.all_content_items
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
    created_at,
    updated_at
FROM public.spreadsheets;

-- 2. 添加注释说明
COMMENT ON VIEW public.all_content_items IS '统一内容视图：合并 documents 和 spreadsheets，用于跨类型搜索和混合列表显示。RLS 通过 security_invoker 继承自底层表。';

-- 3. 验证视图创建成功
-- SELECT type, COUNT(*) FROM public.all_content_items GROUP BY type;
