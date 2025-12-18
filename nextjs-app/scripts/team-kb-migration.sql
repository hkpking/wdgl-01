/**
 * 团队与知识库功能 - 数据库迁移脚本 (修复版)
 * 分两步执行：先建表，再加 RLS
 */

-- ============================================
-- STEP 1: 创建所有表 (不含 RLS)
-- ============================================

-- 1. 部门表
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_departments_parent ON public.departments(parent_id);

-- 2. 部门成员表
CREATE TABLE IF NOT EXISTS public.department_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(department_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_dept_members_dept ON public.department_members(department_id);
CREATE INDEX IF NOT EXISTS idx_dept_members_user ON public.department_members(user_id);

-- 3. 团队表
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    visibility TEXT DEFAULT 'team' CHECK (visibility IN ('public', 'team', 'private')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_teams_owner ON public.teams(owner_id);

-- 4. 团队成员表
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members(user_id);

-- 5. 知识库表
CREATE TABLE IF NOT EXISTS public.knowledge_bases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT '📚',
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    visibility TEXT DEFAULT 'team' CHECK (visibility IN ('public', 'team', 'private')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kb_team ON public.knowledge_bases(team_id);

-- 6. 知识库文件夹表
CREATE TABLE IF NOT EXISTS public.kb_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.kb_folders(id) ON DELETE CASCADE,
    knowledge_base_id UUID REFERENCES public.knowledge_bases(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kb_folders_kb ON public.kb_folders(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_kb_folders_parent ON public.kb_folders(parent_id);

-- 7. 知识库文档表
CREATE TABLE IF NOT EXISTS public.kb_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '无标题文档',
    content TEXT DEFAULT '',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
    folder_id UUID REFERENCES public.kb_folders(id) ON DELETE SET NULL,
    knowledge_base_id UUID REFERENCES public.knowledge_bases(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kb_docs_kb ON public.kb_documents(knowledge_base_id);
CREATE INDEX IF NOT EXISTS idx_kb_docs_folder ON public.kb_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_kb_docs_author ON public.kb_documents(author_id);

-- ============================================
-- STEP 2: 启用 RLS
-- ============================================

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_documents ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: 添加 RLS 策略 (简化版 - 所有认证用户可访问)
-- ============================================

-- 部门
DROP POLICY IF EXISTS "dept_all" ON public.departments;
CREATE POLICY "dept_all" ON public.departments FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "dept_members_all" ON public.department_members;
CREATE POLICY "dept_members_all" ON public.department_members FOR ALL USING (auth.role() = 'authenticated');

-- 团队
DROP POLICY IF EXISTS "teams_select" ON public.teams;
CREATE POLICY "teams_select" ON public.teams FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "teams_insert" ON public.teams;
CREATE POLICY "teams_insert" ON public.teams FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "teams_update" ON public.teams;
CREATE POLICY "teams_update" ON public.teams FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "teams_delete" ON public.teams;
CREATE POLICY "teams_delete" ON public.teams FOR DELETE USING (auth.uid() = owner_id);

-- 团队成员
DROP POLICY IF EXISTS "team_members_all" ON public.team_members;
CREATE POLICY "team_members_all" ON public.team_members FOR ALL USING (auth.role() = 'authenticated');

-- 知识库
DROP POLICY IF EXISTS "kb_all" ON public.knowledge_bases;
CREATE POLICY "kb_all" ON public.knowledge_bases FOR ALL USING (auth.role() = 'authenticated');

-- 知识库文件夹
DROP POLICY IF EXISTS "kb_folders_all" ON public.kb_folders;
CREATE POLICY "kb_folders_all" ON public.kb_folders FOR ALL USING (auth.role() = 'authenticated');

-- 知识库文档
DROP POLICY IF EXISTS "kb_docs_all" ON public.kb_documents;
CREATE POLICY "kb_docs_all" ON public.kb_documents FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- STEP 4: 更新时间触发器
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_departments ON public.departments;
CREATE TRIGGER set_updated_at_departments BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_teams ON public.teams;
CREATE TRIGGER set_updated_at_teams BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_knowledge_bases ON public.knowledge_bases;
CREATE TRIGGER set_updated_at_knowledge_bases BEFORE UPDATE ON public.knowledge_bases FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_kb_folders ON public.kb_folders;
CREATE TRIGGER set_updated_at_kb_folders BEFORE UPDATE ON public.kb_folders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_kb_documents ON public.kb_documents;
CREATE TRIGGER set_updated_at_kb_documents BEFORE UPDATE ON public.kb_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 完成！
-- ============================================
