-- =====================================================
-- 修复表格 RLS 策略：允许团队成员更新团队表格
-- =====================================================

-- 删除旧的只读策略（如果存在）
DROP POLICY IF EXISTS "Team members can view team spreadsheets" ON public.spreadsheets;
DROP POLICY IF EXISTS "Team members can CRUD team spreadsheets" ON public.spreadsheets;

-- 创建新策略：团队成员可以查看和更新团队表格
-- 必须同时包含 USING（读取/删除）和 WITH CHECK（插入/更新）
CREATE POLICY "Team members can CRUD team spreadsheets" ON public.spreadsheets
    FOR ALL
    USING (
        -- 表格所属团队的成员
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
        OR
        -- 表格关联的知识库所属团队的成员
        knowledge_base_id IN (
            SELECT kb.id FROM public.knowledge_bases kb
            INNER JOIN public.team_members tm ON tm.team_id = kb.team_id
            WHERE tm.user_id = auth.uid()
        )
    )
    WITH CHECK (
        -- 相同条件用于 INSERT/UPDATE
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
