-- ============================================
-- 流程天命人 (LCTMR) 数据库 Schema
-- 使用 lctmr_ 前缀与 WDGL 区分
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 阵营表 (factions)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_factions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT DEFAULT '#FFB800',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE lctmr_factions IS '阵营表 - 用户可选择加入的阵营';

-- 插入默认阵营
INSERT INTO lctmr_factions (name, description, icon, color) VALUES
    ('无极派', '以无极之道，修炼心法', '☯️', '#9333EA'),
    ('天策府', '策略为先，运筹帷幄', '⚔️', '#DC2626'),
    ('灵台方寸', '修心悟道，洞察万物', '🔮', '#2563EB'),
    ('花果山', '自由奔放，逍遥自在', '🐒', '#16A34A')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. 用户档案表 (profiles)
-- 扩展 auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    faction_id UUID REFERENCES lctmr_factions(id),
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lctmr_profiles_faction ON lctmr_profiles(faction_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_profiles_points ON lctmr_profiles(total_points DESC);

COMMENT ON TABLE lctmr_profiles IS '用户档案表 - 扩展 Supabase auth.users';

-- ============================================
-- 3. 分类表 (categories)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lctmr_categories_order ON lctmr_categories(order_index);

COMMENT ON TABLE lctmr_categories IS '学习分类表';

-- ============================================
-- 4. 章节表 (chapters)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES lctmr_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lctmr_chapters_category ON lctmr_chapters(category_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_chapters_order ON lctmr_chapters(order_index);

COMMENT ON TABLE lctmr_chapters IS '学习章节表';

-- ============================================
-- 5. 小节/内容块表 (sections)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES lctmr_chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    content_type TEXT DEFAULT 'text', -- text, video, quiz, conversation
    points INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lctmr_sections_chapter ON lctmr_sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_sections_order ON lctmr_sections(order_index);

COMMENT ON TABLE lctmr_sections IS '学习小节/内容块表';

-- ============================================
-- 6. 用户学习进度表 (user_progress)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES lctmr_sections(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    conversation_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, section_id)
);

CREATE INDEX IF NOT EXISTS idx_lctmr_progress_user ON lctmr_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_progress_section ON lctmr_user_progress(section_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_progress_completed ON lctmr_user_progress(is_completed);

COMMENT ON TABLE lctmr_user_progress IS '用户学习进度表';

-- ============================================
-- 7. 积分历史表 (points_history)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source_type TEXT NOT NULL, -- learning, achievement, bonus
    source_id UUID,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lctmr_points_user ON lctmr_points_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lctmr_points_created ON lctmr_points_history(created_at DESC);

COMMENT ON TABLE lctmr_points_history IS '用户积分历史表';

-- ============================================
-- 8. 成就表 (achievements)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    points INTEGER DEFAULT 0,
    condition_type TEXT, -- first_login, complete_chapter, etc
    condition_value JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE lctmr_achievements IS '成就定义表';

-- ============================================
-- 9. 用户成就表 (user_achievements)
-- ============================================
CREATE TABLE IF NOT EXISTS lctmr_user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES lctmr_achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_lctmr_user_achievements_user ON lctmr_user_achievements(user_id);

COMMENT ON TABLE lctmr_user_achievements IS '用户已获得成就表';

-- ============================================
-- 10. RLS 策略
-- ============================================

-- 启用 RLS
ALTER TABLE lctmr_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_user_achievements ENABLE ROW LEVEL SECURITY;

-- 用户档案策略
CREATE POLICY "Users can view own profile" ON lctmr_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON lctmr_profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON lctmr_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 学习进度策略
CREATE POLICY "Users can view own progress" ON lctmr_user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON lctmr_user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON lctmr_user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 积分历史策略
CREATE POLICY "Users can view own points" ON lctmr_points_history
    FOR SELECT USING (auth.uid() = user_id);

-- 用户成就策略
CREATE POLICY "Users can view own achievements" ON lctmr_user_achievements
    FOR SELECT USING (auth.uid() = user_id);

-- 公开表（所有登录用户可读）
CREATE POLICY "Authenticated users can view factions" ON lctmr_factions
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view categories" ON lctmr_categories
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view chapters" ON lctmr_chapters
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view sections" ON lctmr_sections
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view achievements" ON lctmr_achievements
    FOR SELECT TO authenticated USING (true);

-- 启用公开表的 RLS
ALTER TABLE lctmr_factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE lctmr_achievements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. 触发器：自动更新 updated_at
-- ============================================
CREATE OR REPLACE FUNCTION lctmr_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lctmr_profiles_updated_at
    BEFORE UPDATE ON lctmr_profiles
    FOR EACH ROW EXECUTE FUNCTION lctmr_update_updated_at();

CREATE TRIGGER lctmr_sections_updated_at
    BEFORE UPDATE ON lctmr_sections
    FOR EACH ROW EXECUTE FUNCTION lctmr_update_updated_at();

CREATE TRIGGER lctmr_user_progress_updated_at
    BEFORE UPDATE ON lctmr_user_progress
    FOR EACH ROW EXECUTE FUNCTION lctmr_update_updated_at();

-- ============================================
-- 12. 触发器：新用户自动创建档案
-- ============================================
CREATE OR REPLACE FUNCTION lctmr_handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO lctmr_profiles (id, display_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 注意：此触发器需要在 auth.users 上创建，需要管理员权限
-- CREATE TRIGGER on_auth_user_created_lctmr
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION lctmr_handle_new_user();
