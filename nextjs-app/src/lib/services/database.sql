/**
 * Supabase 数据库表结构迁移脚本
 * 
 * 在 Supabase Dashboard > SQL Editor 中执行以下 SQL
 * 或使用 Supabase CLI: supabase db push
 */

-- ============================================
-- 1. 用户配置表 (扩展 auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS 策略: 用户只能访问自己的 profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 自动创建 profile (当用户注册时)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. 文件夹表
-- ============================================
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.folders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_folders_user ON public.folders(user_id);
CREATE INDEX idx_folders_parent ON public.folders(parent_id);

-- RLS
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own folders" ON public.folders
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 3. 文档表
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '无标题文档',
    content TEXT DEFAULT '',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_documents_user ON public.documents(user_id);
CREATE INDEX idx_documents_folder ON public.documents(folder_id);
CREATE INDEX idx_documents_status ON public.documents(status);

-- RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own documents" ON public.documents
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 4. 版本历史表
-- ============================================
CREATE TABLE IF NOT EXISTS public.versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    name TEXT, -- 版本名称 (用户自定义)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_versions_document ON public.versions(document_id);
CREATE INDEX idx_versions_created ON public.versions(created_at DESC);

-- RLS
ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own document versions" ON public.versions
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- 5. 评论表
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- 用于回复
    content TEXT NOT NULL,
    quote TEXT, -- 被引用的文本
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_comments_document ON public.comments(document_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);

-- RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
-- 文档所有者可以管理评论，评论作者可以编辑自己的评论
CREATE POLICY "Document owners and comment authors can manage comments" ON public.comments
    FOR ALL USING (
        auth.uid() = author_id OR 
        auth.uid() IN (SELECT user_id FROM public.documents WHERE id = document_id)
    );

-- ============================================
-- 6. 更新时间触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_folders
    BEFORE UPDATE ON public.folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_documents
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_comments
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
