-- ============================================
-- 通用协同能力表迁移
-- 执行前请先备份数据
-- ============================================

-- 步骤 1: 删除可能存在的旧策略和触发器
DROP TRIGGER IF EXISTS trigger_comments_updated_at ON comments;
DROP FUNCTION IF EXISTS update_comments_updated_at();
DROP POLICY IF EXISTS "Users can view comments on accessible content" ON comments;
DROP POLICY IF EXISTS "Users can add comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
DROP POLICY IF EXISTS "Users can view versions of accessible content" ON versions;
DROP POLICY IF EXISTS "Users can create versions" ON versions;
DROP POLICY IF EXISTS "Users can update version labels" ON versions;
DROP POLICY IF EXISTS "Users can delete own versions" ON versions;

-- 步骤 2: 删除旧表（如果需要全新开始）
-- 注意：如果有数据需要保留，请注释掉下面两行
-- DROP TABLE IF EXISTS comments;
-- DROP TABLE IF EXISTS versions;

-- ============================================
-- 步骤 3: 创建评论表
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL,
    target_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    author_uid VARCHAR(100) NOT NULL,
    author_name VARCHAR(200),
    author_avatar TEXT,
    status VARCHAR(20) DEFAULT 'open',
    quote TEXT,
    start_offset INT,
    end_offset INT,
    cell_row INT,
    cell_col INT,
    page_number INT,
    position_x FLOAT,
    position_y FLOAT,
    replies JSONB DEFAULT '[]'::jsonb,
    mentions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(target_id, status);

-- ============================================
-- 步骤 4: 创建版本历史表
-- ============================================
CREATE TABLE IF NOT EXISTS versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL,
    target_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content JSONB NOT NULL,
    label VARCHAR(100),
    created_by_uid VARCHAR(100) NOT NULL,
    created_by_name VARCHAR(200),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_versions_target ON versions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_versions_created ON versions(target_id, created_at DESC);

-- ============================================
-- 步骤 5: 启用 RLS
-- ============================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 步骤 6: 创建 RLS 策略
-- ============================================

-- 评论表策略
CREATE POLICY "Users can view comments on accessible content" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can add comments" ON comments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid()::text = author_uid);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid()::text = author_uid);

-- 版本表策略
CREATE POLICY "Users can view versions of accessible content" ON versions
    FOR SELECT USING (true);

CREATE POLICY "Users can create versions" ON versions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update version labels" ON versions
    FOR UPDATE USING (auth.uid()::text = created_by_uid);

CREATE POLICY "Users can delete own versions" ON versions
    FOR DELETE USING (auth.uid()::text = created_by_uid);

-- ============================================
-- 步骤 7: 创建更新触发器
-- ============================================
CREATE OR REPLACE FUNCTION update_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_comments_updated_at();
