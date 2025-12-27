-- ============================================================
-- LCTMR 完整数据迁移 SQL
-- 从阿里云 lctmr_production 迁移到 Supabase
-- 请在 Supabase Dashboard -> SQL Editor 中执行此脚本
-- ============================================================

-- ============================================================
-- 1. 导入 factions (部门) - 8条记录
-- ============================================================

INSERT INTO lctmr_factions (code, name, description, color, is_active, sort_order)
VALUES 
    ('it_dept', 'IT技术部', '负责技术开发和系统维护', '#FF5733', true, 1),
    ('im_dept', '信息管理部', '负责信息管理和数据分析', '#33FF57', true, 2),
    ('pmo_dept', '项目综合管理部', '负责项目管理和协调', '#3357FF', true, 3),
    ('dm_dept', '数据管理部', '负责数据管理和治理', '#FF33F5', true, 4),
    ('strategy_dept', '战略管理部', '负责战略规划和决策', '#F5FF33', true, 5),
    ('logistics_dept', '物流IT部', '负责物流信息化建设', '#33FFF5', true, 6),
    ('aoc_dept', '项目AOC', '负责项目运营中心', '#FF8C33', true, 7),
    ('3333_dept', '3333部门', '特殊项目部门', '#8C33FF', true, 8)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    color = EXCLUDED.color,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order;

-- ============================================================
-- 2. 导入 achievements (成就) - 3条记录
-- ============================================================

INSERT INTO lctmr_achievements (id, name, description, trigger_key)
VALUES 
    ('fb5f9136-e977-400c-bb27-f6332ce6ecf9', '初窥门径', '完成你的第一个学习内容块，正式踏上流程天命的征途。', 'COMPLETE_FIRST_BLOCK'),
    ('d9263e23-dc5a-41ed-b00e-5526ed195bf5', '学有所成', '征服一个完整的章节，你的知识体系正在形成。', 'COMPLETE_FIRST_CHAPTER'),
    ('f7f49830-97f6-4709-ab2e-25d9c9f15781', '点石成金', '首次在测验中获得学分，智慧即是财富。', 'SCORE_FIRST_POINTS')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    trigger_key = EXCLUDED.trigger_key;

-- ============================================================
-- 3. 导入 categories (分类) - 2条记录
-- ============================================================

INSERT INTO lctmr_categories (id, title, description, sort_order)
VALUES 
    ('e527bd29-c854-4297-bd06-19a01ef6eff7', '觉醒篇', '初识流程', 0),
    ('6679258c-679d-4e00-a970-9bd6db35ade6', '基础篇', '流程浮现', 1)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- ============================================================
-- 4. 导入 chapters (章节) - 2条记录
-- ============================================================

INSERT INTO lctmr_chapters (id, category_id, title, description, sort_order)
VALUES 
    ('91a7a32d-e139-4977-8aa6-877db9dc0308', 'e527bd29-c854-4297-bd06-19a01ef6eff7', '天命人觉醒', '', 0),
    ('46555e69-87e4-4270-97f9-d133b2438044', '6679258c-679d-4e00-a970-9bd6db35ade6', '流程道心试练', '当你完成了《流程密码》前7篇时，一道精光从你身上直冲天庭。此时，正在查阅奏折的大唐董事，被惊动。"天命人终于出现了"。大唐董事看着光的方向激动的说道。不久，便有人将你带到了大唐董事的面前。看着你充满闪烁的智慧眼睛，大唐董事有预感，大唐必定将重建秩序和繁荣。由是，在大唐董事和国民的期待下，你再次踏上了取经之路。', 0)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- ============================================================
-- 5. 导入 sections (小节) - 8条记录
-- ============================================================

INSERT INTO lctmr_sections (id, chapter_id, title, sort_order)
VALUES 
    ('3388f27f-28e7-4f77-b030-3b1e729a0061', '91a7a32d-e139-4977-8aa6-877db9dc0308', '故事内容', 0),
    ('e6fa35ff-70c7-47f1-aaca-f900e3a84e33', '91a7a32d-e139-4977-8aa6-877db9dc0308', '知识学习', 1),
    ('5820de7a-fb7f-469f-8cf6-8d7b95a185de', '91a7a32d-e139-4977-8aa6-877db9dc0308', '业务实践', 2),
    ('117c673d-592b-4065-bece-8242543ab173', '91a7a32d-e139-4977-8aa6-877db9dc0308', '关卡试炼', 3),
    ('f99cc679-04f9-4417-badd-07ed10b440e7', '46555e69-87e4-4270-97f9-d133b2438044', '故事内容', 0),
    ('851efde3-e8e1-48ea-9bdc-656ed9b0fce5', '46555e69-87e4-4270-97f9-d133b2438044', '知识学习', 1),
    ('bfc065ab-2881-4c50-a1d6-938a051941e7', '46555e69-87e4-4270-97f9-d133b2438044', '业务实践', 2),
    ('b6948952-7ad4-410f-b0c6-ef0ec33c02dd', '46555e69-87e4-4270-97f9-d133b2438044', '关卡试炼', 4)
ON CONFLICT (id) DO UPDATE SET
    chapter_id = EXCLUDED.chapter_id,
    title = EXCLUDED.title,
    sort_order = EXCLUDED.sort_order;

-- ============================================================
-- 6. 导入 profiles (用户档案) - 22条记录
-- ============================================================

INSERT INTO lctmr_profiles (id, username, display_name, points, role)
VALUES 
    ('f58f80be-5b80-43e5-9ecd-17789a903907', 'liqiheng@cosmo-lady.com', 'liqiheng', 190, 'user'),
    ('ea14ad8d-3212-4e06-aacb-9c48ceb0070d', 'liuguang@cosmo-lady.com.cn', 'liuguang', 0, 'user'),
    ('52236e5e-deb1-485a-bdf0-d9bfd3e63df8', 'chenmaoteng@cosmo-lady.com', 'chenmaoteng', 90, 'user'),
    ('7187cf5e-58ec-44c0-a1f0-c6a75806f9c8', 'yuejianglei@cosmo-lady.com.cn', 'yuejianglei', 10, 'user'),
    ('2322b6af-192b-4a79-9e6e-d38dd592df6f', 'yangziyu@cosmo-lady.com.cn', 'yangziyu', 90, 'user'),
    ('8463876b-55ef-4c31-b9b7-b6426fab2fcd', 'yumingzhong@cosmo-lady.com', 'yumingzhong', 100, 'user'),
    ('cacb1509-5fb4-4509-898d-38dd8d4d23be', 'hkpking01@example.com', 'hkpking01', 0, 'user'),
    ('77823c57-6072-497d-93a0-a60fce816f3a', 'dengzhixiong@cosmo-lady.com.cn', 'dengzhixiong', 0, 'user'),
    ('77d0e868-e6db-484c-96a0-f071c6ab6689', 'liangyijian@cosmo-lady.com', 'liangyijian', 60, 'user'),
    ('3ad62335-583b-4fc7-bff3-5792d545f7ec', 'fuwulong@cosmo-lady.com.cn', 'fuwulong', 0, 'user'),
    ('015c5f49-19ea-49bf-bed8-083f7383beaa', 'zhangjunping@cosmo-lady.com', 'zhangjunping', 100, 'user'),
    ('e8b2066d-1abb-45f2-aa37-952efbecb061', 'yuejainglei@cosmo-lady.com.cn', 'yuejainglei', 0, 'user'),
    ('30345913-b52f-4cd0-b314-c8fb90ddb5c8', 'hkpking@example.com', 'hkpking', 100, 'user'),
    ('57d88a71-dde2-4b30-8fe8-b1d911e23067', 'liujiashuanga@cosmo-lady.com.cn', 'liujiashuanga', 0, 'user'),
    ('4aa35680-7d31-44e6-b879-db4636ee8a11', 'yangzhiheng@cosmo-lady.com', 'yangzhiheng', 0, 'user'),
    ('1b9ec97c-26a8-438b-bcda-7aa1e64e7e89', 'chenjinping@cosmo-lady.com.cn', 'chenjinping', 0, 'user'),
    ('5e7bba9d-1d2c-42de-a62f-dee737b23765', 'shule@cosmo-lady.com.cn', 'shule', 0, 'user'),
    ('209e9e9c-77c7-4c70-b2de-1c260b5b9e66', 'wenyuanfeng@cosmo-lady.com.cn', 'wenyuanfeng', 0, 'user'),
    ('72ebb535-b6f6-4571-8ddd-f832009834dd', '1458574484@qq.com', '1458574484', 0, 'user'),
    ('c986bfcb-dd8e-456b-a257-c18b202639db', 'chenyonga@cosmo-lady.com', 'chenyonga', 100, 'user'),
    ('f906e11b-bd21-4b80-9cd5-1ed28ef4d028', 'zhangdongliang@cosmo-lady.com', 'zhangdongliang', 30, 'user'),
    ('8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd', 'liurence@cosmo-lady.com', 'liurence', 100, 'user')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    points = EXCLUDED.points,
    role = EXCLUDED.role;

-- ============================================================
-- 7. 验证导入结果
-- ============================================================

SELECT 'lctmr_factions' as table_name, COUNT(*) as count FROM lctmr_factions
UNION ALL
SELECT 'lctmr_achievements' as table_name, COUNT(*) as count FROM lctmr_achievements
UNION ALL
SELECT 'lctmr_categories' as table_name, COUNT(*) as count FROM lctmr_categories
UNION ALL
SELECT 'lctmr_chapters' as table_name, COUNT(*) as count FROM lctmr_chapters
UNION ALL
SELECT 'lctmr_sections' as table_name, COUNT(*) as count FROM lctmr_sections
UNION ALL
SELECT 'lctmr_profiles' as table_name, COUNT(*) as count FROM lctmr_profiles;

-- ============================================================
-- 迁移完成！
-- 预期结果:
-- - lctmr_factions: 8 条
-- - lctmr_achievements: 3 条
-- - lctmr_categories: 2 条
-- - lctmr_chapters: 2 条
-- - lctmr_sections: 8 条
-- - lctmr_profiles: 22 条
-- ============================================================
