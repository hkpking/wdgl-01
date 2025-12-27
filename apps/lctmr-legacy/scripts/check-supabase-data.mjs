/**
 * Supabase 数据检查脚本
 * 检查用户数据迁移状态
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 配置（从 database-config.js 获取）
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabase() {
    console.log('='.repeat(60));
    console.log('🔍 Supabase 数据库检查');
    console.log('='.repeat(60));
    console.log(`URL: ${SUPABASE_URL}`);
    console.log('');

    // 检查表列表
    const tables = [
        'lctmr_profiles',
        'lctmr_user_progress',
        'lctmr_categories',
        'lctmr_chapters',
        'lctmr_sections',
        'lctmr_blocks',
        'lctmr_achievements',
        'lctmr_user_achievements',
        'lctmr_challenges',
        'lctmr_factions'
    ];

    for (const table of tables) {
        try {
            const { data, error, count } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: false })
                .limit(5);

            if (error) {
                console.log(`❌ ${table}: 错误 - ${error.message}`);
            } else {
                console.log(`✅ ${table}: ${data?.length || 0} 条记录`);

                // 对于 profiles 表，显示更多详情
                if (table === 'lctmr_profiles' && data && data.length > 0) {
                    console.log('   用户列表:');
                    data.forEach(user => {
                        console.log(`   - ID: ${user.id?.substring(0, 8)}... | 用户名: ${user.username || user.display_name || '未设置'} | Role: ${user.role || 'N/A'}`);
                    });
                }
            }
        } catch (err) {
            console.log(`❌ ${table}: 异常 - ${err.message}`);
        }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('📊 详细用户数据检查');
    console.log('='.repeat(60));

    // 详细检查 profiles
    try {
        const { data: profiles, error } = await supabase
            .from('lctmr_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.log(`profiles 查询错误: ${error.message}`);
        } else {
            console.log(`\n总用户数: ${profiles?.length || 0}`);
            if (profiles && profiles.length > 0) {
                console.log('\n用户详情:');
                console.log('-'.repeat(50));
                profiles.forEach((p, i) => {
                    console.log(`${i + 1}. ID: ${p.id}`);
                    console.log(`   用户名: ${p.username || p.display_name || '未设置'}`);
                    console.log(`   角色: ${p.role || 'user'}`);
                    console.log(`   积分: ${p.points || 0}`);
                    console.log(`   创建时间: ${p.created_at || '未知'}`);
                    console.log('-'.repeat(50));
                });
            } else {
                console.log('\n⚠️ 没有找到用户数据！');
            }
        }
    } catch (err) {
        console.log(`profiles 查询异常: ${err.message}`);
    }

    // 检查 user_progress
    try {
        const { data: progress, error } = await supabase
            .from('lctmr_user_progress')
            .select('user_id')
            .limit(100);

        if (error) {
            console.log(`\nuser_progress 查询错误: ${error.message}`);
        } else {
            const uniqueUsers = [...new Set(progress?.map(p => p.user_id) || [])];
            console.log(`\n学习进度记录: ${progress?.length || 0} 条`);
            console.log(`涉及用户数: ${uniqueUsers.length}`);
        }
    } catch (err) {
        console.log(`user_progress 查询异常: ${err.message}`);
    }

    console.log('\n' + '='.repeat(60));
}

checkDatabase().catch(console.error);
