-- =====================================================
-- 🔧 紧急修复：表格单元格数据保存失败
-- 问题：RLS 策略缺少 user_id 条件，导致用户无法更新自己创建的表格
-- 在 Supabase SQL Editor (https://supabase.com/dashboard) 执行此脚本
-- =====================================================

-- 1. 删除所有旧策略
DROP POLICY IF EXISTS "Team members can view team spreadsheets" ON public.spreadsheets;
DROP POLICY IF EXISTS "Team members can CRUD team spreadsheets" ON public.spreadsheets;
DROP POLICY IF EXISTS "Users can CRUD own spreadsheets" ON public.spreadsheets;

-- 2. 创建新的综合策略：用户可以管理自己的表格 + 团队成员可以管理团队表格
CREATE POLICY "Spreadsheets access policy" ON public.spreadsheets
    FOR ALL
    USING (
        -- 条件 1: 用户是表格的创建者
        auth.uid() = user_id
        OR
        -- 条件 2: 用户是表格所属团队的成员
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
        OR
        -- 条件 3: 用户是表格关联知识库所属团队的成员
        knowledge_base_id IN (
            SELECT kb.id FROM public.knowledge_bases kb
            INNER JOIN public.team_members tm ON tm.team_id = kb.team_id
            WHERE tm.user_id = auth.uid()
        )
    )
    WITH CHECK (
        -- 相同条件用于 INSERT/UPDATE
        auth.uid() = user_id
        OR
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
SELECT policyname, cmd, roles, qual 
FROM pg_policies 
WHERE tablename = 'spreadsheets';
