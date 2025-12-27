-- =====================================================
-- 电子表格模块数据表
-- =====================================================

-- 1. 电子表格主表
CREATE TABLE IF NOT EXISTS public.spreadsheets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '无标题表格',
    data JSONB DEFAULT '[]',  -- FortuneSheet 格式数据
    folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    knowledge_base_id UUID REFERENCES public.knowledge_bases(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_spreadsheets_user ON public.spreadsheets(user_id);
CREATE INDEX IF NOT EXISTS idx_spreadsheets_folder ON public.spreadsheets(folder_id);
CREATE INDEX IF NOT EXISTS idx_spreadsheets_team ON public.spreadsheets(team_id);
CREATE INDEX IF NOT EXISTS idx_spreadsheets_kb ON public.spreadsheets(knowledge_base_id);

-- RLS
ALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;

-- 用户可以操作自己的表格
CREATE POLICY "Users can CRUD own spreadsheets" ON public.spreadsheets
    FOR ALL USING (auth.uid() = user_id);

-- 团队成员可以查看团队表格
CREATE POLICY "Team members can view team spreadsheets" ON public.spreadsheets
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- 2. 表格向量化存储
CREATE TABLE IF NOT EXISTS public.spreadsheet_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spreadsheet_id UUID REFERENCES public.spreadsheets(id) ON DELETE CASCADE NOT NULL,
    chunk_index INTEGER NOT NULL,
    chunk_text TEXT NOT NULL,
    content_hash VARCHAR(32),
    embedding vector(384),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_spreadsheet_emb_id ON public.spreadsheet_embeddings(spreadsheet_id);
CREATE INDEX IF NOT EXISTS idx_spreadsheet_emb_hash ON public.spreadsheet_embeddings(spreadsheet_id, content_hash);

-- 向量索引 (需要 pgvector 扩展已启用)
-- CREATE INDEX IF NOT EXISTS idx_spreadsheet_emb_vec ON public.spreadsheet_embeddings 
--     USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- RLS
ALTER TABLE public.spreadsheet_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Spreadsheet embeddings follow parent RLS" ON public.spreadsheet_embeddings
    FOR ALL USING (
        spreadsheet_id IN (
            SELECT id FROM public.spreadsheets WHERE user_id = auth.uid()
        )
    );

-- 3. 更新时间触发器
CREATE OR REPLACE TRIGGER set_updated_at_spreadsheets
    BEFORE UPDATE ON public.spreadsheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
