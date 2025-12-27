-- 对话学习进度表初始化脚本
-- 用于存储用户的碎片式学习进度

-- 创建对话学习进度表
CREATE TABLE IF NOT EXISTS conversation_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_block_id VARCHAR(255) NOT NULL,
    current_step INTEGER NOT NULL DEFAULT 0,
    total_steps INTEGER NOT NULL DEFAULT 0,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    points_earned INTEGER NOT NULL DEFAULT 0,
    completed_tests JSONB DEFAULT '[]'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    conversation_data JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- 确保同一用户对同一内容块只有一条记录
    UNIQUE(user_id, content_block_id)
);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_conversation_progress_user_id ON conversation_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_progress_block_id ON conversation_progress(content_block_id);
CREATE INDEX IF NOT EXISTS idx_conversation_progress_user_block ON conversation_progress(user_id, content_block_id);
CREATE INDEX IF NOT EXISTS idx_conversation_progress_completed ON conversation_progress(is_completed);
CREATE INDEX IF NOT EXISTS idx_conversation_progress_updated ON conversation_progress(updated_at DESC);

-- 创建用户积分历史表（如果不存在）
CREATE TABLE IF NOT EXISTS user_points_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'conversation_learning', 'achievement', 'manual', etc.
    source_id VARCHAR(255), -- 关联的内容ID（如 block_id, achievement_id 等）
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建积分历史索引
CREATE INDEX IF NOT EXISTS idx_user_points_history_user_id ON user_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_source ON user_points_history(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_user_points_history_created ON user_points_history(created_at DESC);

-- 创建更新时间自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为对话学习进度表添加更新触发器
DROP TRIGGER IF EXISTS update_conversation_progress_updated_at ON conversation_progress;
CREATE TRIGGER update_conversation_progress_updated_at
    BEFORE UPDATE ON conversation_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据（仅在开发环境中使用）
-- 注意：生产环境中应该删除此部分

-- 创建视图方便查询统计信息
CREATE OR REPLACE VIEW conversation_learning_stats AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(*) as total_conversations,
    COUNT(*) FILTER (WHERE cp.is_completed = true) as completed_conversations,
    SUM(cp.points_earned) as total_points,
    AVG(cp.progress_percentage) as average_progress,
    COUNT(DISTINCT cp.content_block_id) as unique_blocks,
    MAX(cp.updated_at) as last_learning_date
FROM users u
LEFT JOIN conversation_progress cp ON u.id = cp.user_id
GROUP BY u.id, u.username;

-- 添加注释
COMMENT ON TABLE conversation_progress IS '对话学习进度表 - 存储用户的碎片式学习进度';
COMMENT ON COLUMN conversation_progress.user_id IS '用户ID';
COMMENT ON COLUMN conversation_progress.content_block_id IS '学习内容块ID';
COMMENT ON COLUMN conversation_progress.current_step IS '当前学习步骤';
COMMENT ON COLUMN conversation_progress.total_steps IS '总学习步骤数';
COMMENT ON COLUMN conversation_progress.progress_percentage IS '学习进度百分比';
COMMENT ON COLUMN conversation_progress.points_earned IS '获得的积分';
COMMENT ON COLUMN conversation_progress.completed_tests IS '已完成的测试记录（JSON数组）';
COMMENT ON COLUMN conversation_progress.is_completed IS '是否已完成学习';
COMMENT ON COLUMN conversation_progress.conversation_data IS '对话数据（JSON格式）';
COMMENT ON COLUMN conversation_progress.last_accessed_at IS '最后访问时间';

COMMENT ON TABLE user_points_history IS '用户积分历史记录表';
COMMENT ON VIEW conversation_learning_stats IS '对话学习统计视图 - 提供用户学习统计信息';