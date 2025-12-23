-- =====================================================
-- 🔧 紧急修复：表格保存数据丢失问题
-- 在 Supabase SQL Editor (https://supabase.com/dashboard) 执行此脚本
-- =====================================================

-- 1. 删除旧策略
DROP POLICY IF EXISTS "Team members can view team spreadsheets" ON public.spreadsheets;
DROP POLICY IF EXISTS "Team members can CRUD team spreadsheets" ON public.spreadsheets;

-- 2. 创建新策略（包含 WITH CHECK）
CREATE POLICY "Team members can CRUD team spreadsheets" ON public.spreadsheets
    FOR ALL
    USING (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
        OR
        knowledge_base_id IN (
            SELECT kb.id FROM public.knowledge_bases kb
            INNER JOIN public.team_members tm ON tm.team_id = kb.team_id
            WHERE tm.user_id = auth.uid()
        )
    )
    WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
        OR
        knowledge_base_id IN (
            SELECT kb.id FROM public.knowledge_bases kb
            INNER JOIN public.team_members tm ON tm.team_id = kb.team_id
            WHERE tm.user_id = auth.uid()
        )
    );

-- 3. 验证策略已创建
SELECT polname, polcmd, 
       CASE WHEN polqual IS NOT NULL THEN '✅ USING' ELSE '❌ 缺失' END as using_clause,
       CASE WHEN polwithcheck IS NOT NULL THEN '✅ WITH CHECK' ELSE '❌ 缺失' END as with_check_clause
FROM pg_policy 
WHERE polrelid = 'public.spreadsheets'::regclass;
