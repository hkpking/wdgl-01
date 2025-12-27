/**
 * 将阿里云数据迁移到 Supabase
 * 迁移 lctmr_production 的用户数据到 Supabase lctmr_ 前缀表
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 从阿里云导出的数据
const scoresData = [
    { user_id: 'f58f80be-5b80-43e5-9ecd-17789a903907', username: 'liqiheng@cosmo-lady.com', points: 190 },
    { user_id: 'ea14ad8d-3212-4e06-aacb-9c48ceb0070d', username: 'liuguang@cosmo-lady.com.cn', points: 0 },
    { user_id: '52236e5e-deb1-485a-bdf0-d9bfd3e63df8', username: 'chenmaoteng@cosmo-lady.com', points: 90 },
    { user_id: '7187cf5e-58ec-44c0-a1f0-c6a75806f9c8', username: 'yuejianglei@cosmo-lady.com.cn', points: 10 },
    { user_id: '2322b6af-192b-4a79-9e6e-d38dd592df6f', username: 'yangziyu@cosmo-lady.com.cn', points: 90 },
    { user_id: '8463876b-55ef-4c31-b9b7-b6426fab2fcd', username: 'yumingzhong@cosmo-lady.com', points: 100 },
    { user_id: 'cacb1509-5fb4-4509-898d-38dd8d4d23be', username: 'hkpking01@example.com', points: 0 },
    { user_id: '77823c57-6072-497d-93a0-a60fce816f3a', username: 'dengzhixiong@cosmo-lady.com.cn', points: 0 },
    { user_id: '77d0e868-e6db-484c-96a0-f071c6ab6689', username: 'liangyijian@cosmo-lady.com', points: 60 },
    { user_id: '3ad62335-583b-4fc7-bff3-5792d545f7ec', username: 'fuwulong@cosmo-lady.com.cn', points: 0 },
    { user_id: '015c5f49-19ea-49bf-bed8-083f7383beaa', username: 'zhangjunping@cosmo-lady.com', points: 100 },
    { user_id: 'e8b2066d-1abb-45f2-aa37-952efbecb061', username: 'yuejainglei@cosmo-lady.com.cn', points: 0 },
    { user_id: '30345913-b52f-4cd0-b314-c8fb90ddb5c8', username: 'hkpking@example.com', points: 100 },
    { user_id: '57d88a71-dde2-4b30-8fe8-b1d911e23067', username: 'liujiashuanga@cosmo-lady.com.cn', points: 0 },
    { user_id: '4aa35680-7d31-44e6-b879-db4636ee8a11', username: 'yangzhiheng@cosmo-lady.com', points: 0 },
    { user_id: '1b9ec97c-26a8-438b-bcda-7aa1e64e7e89', username: 'chenjinping@cosmo-lady.com.cn', points: 0 },
    { user_id: '5e7bba9d-1d2c-42de-a62f-dee737b23765', username: 'shule@cosmo-lady.com.cn', points: 0 },
    { user_id: '209e9e9c-77c7-4c70-b2de-1c260b5b9e66', username: 'wenyuanfeng@cosmo-lady.com.cn', points: 0 },
    { user_id: '72ebb535-b6f6-4571-8ddd-f832009834dd', username: '1458574484@qq.com', points: 0 },
    { user_id: 'c986bfcb-dd8e-456b-a257-c18b202639db', username: 'chenyonga@cosmo-lady.com', points: 100 },
    { user_id: 'f906e11b-bd21-4b80-9cd5-1ed28ef4d028', username: 'zhangdongliang@cosmo-lady.com', points: 30 },
    { user_id: '8423ddb9-0129-4d5e-9f7b-84c8a3cd16cd', username: 'liurence@cosmo-lady.com', points: 100 },
];

const factionsData = [
    { id: 1, code: 'it_dept', name: 'IT技术部', description: '负责技术开发和系统维护', color: '#FF5733', is_active: true, sort_order: 1 },
    { id: 2, code: 'im_dept', name: '信息管理部', description: '负责信息管理和数据分析', color: '#33FF57', is_active: true, sort_order: 2 },
    { id: 3, code: 'pmo_dept', name: '项目综合管理部', description: '负责项目管理和协调', color: '#3357FF', is_active: true, sort_order: 3 },
    { id: 4, code: 'dm_dept', name: '数据管理部', description: '负责数据管理和治理', color: '#FF33F5', is_active: true, sort_order: 4 },
    { id: 5, code: 'strategy_dept', name: '战略管理部', description: '负责战略规划和决策', color: '#F5FF33', is_active: true, sort_order: 5 },
    { id: 6, code: 'logistics_dept', name: '物流IT部', description: '负责物流信息化建设', color: '#33FFF5', is_active: true, sort_order: 6 },
    { id: 7, code: 'aoc_dept', name: '项目AOC', description: '负责项目运营中心', color: '#FF8C33', is_active: true, sort_order: 7 },
    { id: 8, code: '3333_dept', name: '3333部门', description: '特殊项目部门', color: '#8C33FF', is_active: true, sort_order: 8 },
];

const achievementsData = [
    { id: 'fb5f9136-e977-400c-bb27-f6332ce6ecf9', name: '初窥门径', description: '完成你的第一个学习内容块，正式踏上流程天命的征途。', icon_url: 'https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/64/external-gate-ancient-egypt-flatart-icons-lineal-color-flatarticons.png', trigger_key: 'COMPLETE_FIRST_BLOCK' },
    { id: 'd9263e23-dc5a-41ed-b00e-5526ed195bf5', name: '学有所成', description: '征服一个完整的章节，你的知识体系正在形成。', icon_url: 'https://img.icons8.com/external-flat-icons-vectorslab/68/external-Scroll-ancient-egypt-flat-icons-vectorslab.png', trigger_key: 'COMPLETE_FIRST_CHAPTER' },
    { id: 'f7f49830-97f6-4709-ab2e-25d9c9f15781', name: '点石成金', description: '首次在测验中获得学分，智慧即是财富。', icon_url: 'https://img.icons8.com/fluency/48/stack-of-coins.png', trigger_key: 'SCORE_FIRST_POINTS' },
];

async function migrateData() {
    console.log('='.repeat(60));
    console.log('🚀 开始迁移数据到 Supabase');
    console.log('='.repeat(60));

    // 1. 迁移 factions
    console.log('\n📦 迁移 factions (部门) ...');
    try {
        const { data, error } = await supabase
            .from('lctmr_factions')
            .upsert(factionsData, { onConflict: 'id' });
        if (error) {
            console.log(`❌ factions 迁移失败: ${error.message}`);
        } else {
            console.log(`✅ factions 迁移成功: ${factionsData.length} 条记录`);
        }
    } catch (err) {
        console.log(`❌ factions 异常: ${err.message}`);
    }

    // 2. 迁移 achievements
    console.log('\n📦 迁移 achievements (成就) ...');
    try {
        const { data, error } = await supabase
            .from('lctmr_achievements')
            .upsert(achievementsData, { onConflict: 'id' });
        if (error) {
            console.log(`❌ achievements 迁移失败: ${error.message}`);
        } else {
            console.log(`✅ achievements 迁移成功: ${achievementsData.length} 条记录`);
        }
    } catch (err) {
        console.log(`❌ achievements 异常: ${err.message}`);
    }

    // 3. 迁移 profiles (用户档案)
    console.log('\n📦 迁移 profiles (用户档案) ...');
    const profilesData = scoresData.map(s => ({
        id: s.user_id,
        username: s.username,
        display_name: s.username.split('@')[0],
        points: s.points,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));

    try {
        const { data, error } = await supabase
            .from('lctmr_profiles')
            .upsert(profilesData, { onConflict: 'id' });
        if (error) {
            console.log(`❌ profiles 迁移失败: ${error.message}`);
        } else {
            console.log(`✅ profiles 迁移成功: ${profilesData.length} 条记录`);
        }
    } catch (err) {
        console.log(`❌ profiles 异常: ${err.message}`);
    }

    // 4. 验证迁移结果
    console.log('\n' + '='.repeat(60));
    console.log('📊 验证迁移结果');
    console.log('='.repeat(60));

    const tables = ['lctmr_profiles', 'lctmr_factions', 'lctmr_achievements'];
    for (const table of tables) {
        try {
            const { data, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: false });
            if (error) {
                console.log(`❌ ${table}: 查询失败 - ${error.message}`);
            } else {
                console.log(`✅ ${table}: ${data?.length || 0} 条记录`);
            }
        } catch (err) {
            console.log(`❌ ${table}: 异常 - ${err.message}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ 数据迁移完成');
    console.log('='.repeat(60));
}

migrateData().catch(console.error);
