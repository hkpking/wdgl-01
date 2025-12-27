-- ============================================
-- 数据迁移脚本
-- 从 auth.users 迁移到 public.users
-- ============================================

-- 第一步：迁移用户数据（从 auth.users 到 public.users）
INSERT INTO public.users (id, email, password_hash, created_at, updated_at)
SELECT 
    id, 
    email, 
    COALESCE(encrypted_password, 'dummy_hash') as password_hash,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 第二步：迁移用户档案（确保所有用户都有profile）
INSERT INTO public.profiles (id, role, full_name, faction, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(p.role, 'user') as role,
    p.full_name,
    p.faction,
    COALESCE(p.created_at, NOW()) as created_at,
    COALESCE(p.updated_at, NOW()) as updated_at
FROM public.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = u.id)
ON CONFLICT (id) DO UPDATE SET
    role = COALESCE(EXCLUDED.role, public.profiles.role),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    faction = COALESCE(EXCLUDED.faction, public.profiles.faction);

-- 第三步：确保所有用户都有scores记录
INSERT INTO public.scores (user_id, username, points, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(s.username, u.email) as username,
    COALESCE(s.points, 0) as points,
    COALESCE(s.created_at, NOW()) as created_at,
    COALESCE(s.updated_at, NOW()) as updated_at
FROM public.users u
LEFT JOIN public.scores s ON u.id = s.user_id
WHERE NOT EXISTS (SELECT 1 FROM public.scores WHERE user_id = u.id)
ON CONFLICT (user_id) DO UPDATE SET
    username = COALESCE(EXCLUDED.username, public.scores.username),
    points = COALESCE(EXCLUDED.points, public.scores.points);

-- 第四步：确保所有用户都有user_progress记录
INSERT INTO public.user_progress (user_id, completed_blocks, awarded_points_blocks, created_at, updated_at)
SELECT 
    u.id,
    COALESCE(up.completed_blocks, '{}') as completed_blocks,
    COALESCE(up.awarded_points_blocks, '{}') as awarded_points_blocks,
    COALESCE(up.created_at, NOW()) as created_at,
    COALESCE(up.updated_at, NOW()) as updated_at
FROM public.users u
LEFT JOIN public.user_progress up ON u.id = up.user_id
WHERE NOT EXISTS (SELECT 1 FROM public.user_progress WHERE user_id = u.id)
ON CONFLICT (user_id) DO UPDATE SET
    completed_blocks = COALESCE(EXCLUDED.completed_blocks, public.user_progress.completed_blocks),
    awarded_points_blocks = COALESCE(EXCLUDED.awarded_points_blocks, public.user_progress.awarded_points_blocks);

-- 统计信息
DO $$
DECLARE
    user_count INTEGER;
    profile_count INTEGER;
    score_count INTEGER;
    progress_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.users;
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    SELECT COUNT(*) INTO score_count FROM public.scores;
    SELECT COUNT(*) INTO progress_count FROM public.user_progress;
    
    RAISE NOTICE '✅ 数据迁移完成！';
    RAISE NOTICE '📊 数据统计：';
    RAISE NOTICE '   - 用户总数: %', user_count;
    RAISE NOTICE '   - 档案总数: %', profile_count;
    RAISE NOTICE '   - 积分记录: %', score_count;
    RAISE NOTICE '   - 进度记录: %', progress_count;
    
    IF user_count = profile_count AND user_count = score_count AND user_count = progress_count THEN
        RAISE NOTICE '✅ 数据完整性检查通过！';
    ELSE
        RAISE WARNING '⚠️ 数据不一致，请检查！';
    END IF;
END $$;

