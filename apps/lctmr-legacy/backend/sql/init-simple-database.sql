-- ============================================
-- 流程天命人 - 简化数据库初始化脚本
-- 去除Supabase依赖，使用标准PostgreSQL
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. 核心用户表（替代 auth.users）
-- ============================================
DROP TABLE IF EXISTS public.users CASCADE;
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
COMMENT ON TABLE public.users IS '用户认证表';

-- ============================================
-- 2. 用户档案表
-- ============================================
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user',
    full_name TEXT,
    faction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_faction ON public.profiles(faction);
COMMENT ON TABLE public.profiles IS '用户档案表';

-- ============================================
-- 3. 用户积分表
-- ============================================
DROP TABLE IF EXISTS public.scores CASCADE;
CREATE TABLE public.scores (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    username TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scores_points ON public.scores(points DESC);
COMMENT ON TABLE public.scores IS '用户积分表';

-- ============================================
-- 4. 用户学习进度表
-- ============================================
DROP TABLE IF EXISTS public.user_progress CASCADE;
CREATE TABLE public.user_progress (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    completed_blocks TEXT[] DEFAULT '{}',
    awarded_points_blocks TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.user_progress IS '用户学习进度表';

-- ============================================
-- 5. 学习内容：分类
-- ============================================
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_order ON public.categories("order");
COMMENT ON TABLE public.categories IS '学习内容分类';

-- ============================================
-- 6. 学习内容：章节
-- ============================================
DROP TABLE IF EXISTS public.chapters CASCADE;
CREATE TABLE public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chapters_category ON public.chapters(category_id);
CREATE INDEX idx_chapters_order ON public.chapters("order");
COMMENT ON TABLE public.chapters IS '学习章节';

-- ============================================
-- 7. 学习内容：小节
-- ============================================
DROP TABLE IF EXISTS public.sections CASCADE;
CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sections_chapter ON public.sections(chapter_id);
CREATE INDEX idx_sections_order ON public.sections("order");
COMMENT ON TABLE public.sections IS '学习小节';

-- ============================================
-- 8. 学习内容：学习块
-- ============================================
DROP TABLE IF EXISTS public.blocks CASCADE;
CREATE TABLE public.blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    type VARCHAR(50) DEFAULT 'text',
    points INTEGER DEFAULT 0,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_blocks_section ON public.blocks(section_id);
CREATE INDEX idx_blocks_order ON public.blocks("order");
COMMENT ON TABLE public.blocks IS '学习内容块';

-- ============================================
-- 9. 阵营表
-- ============================================
DROP TABLE IF EXISTS public.factions CASCADE;
CREATE TABLE public.factions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_factions_sort_order ON public.factions(sort_order);
COMMENT ON TABLE public.factions IS '阵营表';

-- ============================================
-- 10. 挑战表
-- ============================================
DROP TABLE IF EXISTS public.challenges CASCADE;
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    target_category_id UUID REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_is_active ON public.challenges(is_active);
COMMENT ON TABLE public.challenges IS '挑战表';

-- ============================================
-- 11. 成就表
-- ============================================
DROP TABLE IF EXISTS public.achievements CASCADE;
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.achievements IS '成就表';

-- ============================================
-- 12. 用户成就表
-- ============================================
DROP TABLE IF EXISTS public.user_achievements CASCADE;
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
COMMENT ON TABLE public.user_achievements IS '用户成就表';

-- ============================================
-- 13. 用户徽章表
-- ============================================
DROP TABLE IF EXISTS public.user_badges CASCADE;
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    badge_name TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_badges_user ON public.user_badges(user_id);
COMMENT ON TABLE public.user_badges IS '用户徽章表';

-- ============================================
-- 14. 对话学习进度表
-- ============================================
DROP TABLE IF EXISTS public.conversation_progress CASCADE;
CREATE TABLE public.conversation_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content_block_id UUID,
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    completed_tests JSONB DEFAULT '[]',
    is_completed BOOLEAN DEFAULT false,
    conversation_data JSONB,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, content_block_id)
);

CREATE INDEX idx_conversation_progress_user ON public.conversation_progress(user_id);
CREATE INDEX idx_conversation_progress_block ON public.conversation_progress(content_block_id);
COMMENT ON TABLE public.conversation_progress IS '对话学习进度表';

-- ============================================
-- 15. 用户积分历史表
-- ============================================
DROP TABLE IF EXISTS public.user_points_history CASCADE;
CREATE TABLE public.user_points_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL,
    source_type VARCHAR(50),
    source_id TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_points_history_user ON public.user_points_history(user_id);
CREATE INDEX idx_user_points_history_created ON public.user_points_history(created_at DESC);
COMMENT ON TABLE public.user_points_history IS '用户积分历史表';

-- ============================================
-- 触发器函数
-- ============================================

-- 自动创建用户相关记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 创建用户档案
    INSERT INTO public.profiles (id, role, full_name)
    VALUES (NEW.id, 'user', NULL);
    
    -- 创建积分记录
    INSERT INTO public.scores (user_id, username, points)
    VALUES (NEW.id, NEW.email, 0);
    
    -- 创建学习进度记录
    INSERT INTO public.user_progress (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 应用触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON public.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 更新时间戳函数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用更新时间戳触发器
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_scores_updated_at ON public.scores;
CREATE TRIGGER update_scores_updated_at 
    BEFORE UPDATE ON public.scores
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversation_progress_updated_at ON public.conversation_progress;
CREATE TRIGGER update_conversation_progress_updated_at 
    BEFORE UPDATE ON public.conversation_progress
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 完成提示
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '✅ 数据库表结构创建完成！';
    RAISE NOTICE '📊 表统计：';
    RAISE NOTICE '   - 用户相关: users, profiles, scores, user_progress';
    RAISE NOTICE '   - 学习内容: categories, chapters, sections, blocks';
    RAISE NOTICE '   - 游戏化: factions, challenges, achievements';
    RAISE NOTICE '   - 对话学习: conversation_progress';
    RAISE NOTICE '🔧 触发器已设置：新用户自动创建profile、scores、progress';
END $$;

