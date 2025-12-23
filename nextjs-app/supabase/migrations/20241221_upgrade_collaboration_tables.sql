-- ============================================
-- 升级现有表结构（添加缺失字段）
-- 适用于已有 comments 和 versions 表的情况
-- ============================================

-- 步骤 1: 为 comments 表添加缺失字段
ALTER TABLE comments ADD COLUMN IF NOT EXISTS target_type VARCHAR(20);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS target_id UUID;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS cell_row INT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS cell_col INT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS page_number INT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS position_x FLOAT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS position_y FLOAT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS start_offset INT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS end_offset INT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_uid VARCHAR(100);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_name VARCHAR(200);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS mentions TEXT[] DEFAULT '{}';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS replies JSONB DEFAULT '[]'::jsonb;

-- 步骤 2: 为 versions 表添加缺失字段
ALTER TABLE versions ADD COLUMN IF NOT EXISTS target_type VARCHAR(20);
ALTER TABLE versions ADD COLUMN IF NOT EXISTS target_id UUID;
ALTER TABLE versions ADD COLUMN IF NOT EXISTS created_by_uid VARCHAR(100);
ALTER TABLE versions ADD COLUMN IF NOT EXISTS created_by_name VARCHAR(200);
ALTER TABLE versions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 步骤 3: 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_comments_target ON comments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_versions_target ON versions(target_type, target_id);

-- 步骤 4: 更新现有记录，填充 target_type 和 target_id
-- 如果 comments 表有 doc_id 字段，将其迁移到 target_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'comments' AND column_name = 'doc_id') THEN
        UPDATE comments SET target_type = 'document', target_id = doc_id WHERE target_type IS NULL;
    END IF;
END $$;

-- 如果 versions 表有 doc_id 字段，将其迁移到 target_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'versions' AND column_name = 'doc_id') THEN
        UPDATE versions SET target_type = 'document', target_id = doc_id WHERE target_type IS NULL;
    END IF;
END $$;

-- 完成
SELECT 'Migration completed successfully!' as status;
