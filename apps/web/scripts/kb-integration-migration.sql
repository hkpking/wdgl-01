-- 知识库文档整合迁移
-- 在 documents 表添加 knowledge_base_id 字段，关联知识库

-- 1. 添加 knowledge_base_id 字段
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS knowledge_base_id UUID REFERENCES knowledge_bases(id) ON DELETE SET NULL;

-- 2. 添加索引
CREATE INDEX IF NOT EXISTS idx_documents_knowledge_base_id 
ON documents(knowledge_base_id);

-- 3. 添加 team_id 字段（用于团队文档筛选）
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_documents_team_id 
ON documents(team_id);

-- 4. 注释
COMMENT ON COLUMN documents.knowledge_base_id IS '所属知识库ID，NULL表示个人文档';
COMMENT ON COLUMN documents.team_id IS '所属团队ID，NULL表示个人文档';
