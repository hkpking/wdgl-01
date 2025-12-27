/**
 * 批量创建阿里云遗留用户账号到 Supabase
 * 使用 Service Role Key 创建带默认密码的用户
 */

import { createClient } from '@supabase/supabase-js';

// Supabase 配置 - 使用 Service Role Key
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDkzMDgzNSwiZXhwIjoyMDgwNTA2ODM1fQ.XnHTJabQDyJLdpf3CKZCyQ_3p0ZNQ4_';

// 默认密码（建议用户首次登录后修改）
const DEFAULT_PASSWORD = 'Lctmr@2025';

// 阿里云用户数据
const legacyUsers = [
    { email: 'liqiheng@cosmo-lady.com', username: 'liqiheng', points: 190 },
    { email: 'liuguang@cosmo-lady.com.cn', username: 'liuguang', points: 0 },
    { email: 'chenmaoteng@cosmo-lady.com', username: 'chenmaoteng', points: 90 },
    { email: 'yuejianglei@cosmo-lady.com.cn', username: 'yuejianglei', points: 10 },
    { email: 'yangziyu@cosmo-lady.com.cn', username: 'yangziyu', points: 90 },
    { email: 'yumingzhong@cosmo-lady.com', username: 'yumingzhong', points: 100 },
    { email: 'hkpking01@example.com', username: 'hkpking01', points: 0 },
    { email: 'dengzhixiong@cosmo-lady.com.cn', username: 'dengzhixiong', points: 0 },
    { email: 'liangyijian@cosmo-lady.com', username: 'liangyijian', points: 60 },
    { email: 'fuwulong@cosmo-lady.com.cn', username: 'fuwulong', points: 0 },
    { email: 'zhangjunping@cosmo-lady.com', username: 'zhangjunping', points: 100 },
    { email: 'yuejainglei@cosmo-lady.com.cn', username: 'yuejainglei', points: 0 },
    { email: 'hkpking@example.com', username: 'hkpking', points: 100 },
    { email: 'liujiashuanga@cosmo-lady.com.cn', username: 'liujiashuanga', points: 0 },
    { email: 'yangzhiheng@cosmo-lady.com', username: 'yangzhiheng', points: 0 },
    { email: 'chenjinping@cosmo-lady.com.cn', username: 'chenjinping', points: 0 },
    { email: 'shule@cosmo-lady.com.cn', username: 'shule', points: 0 },
    { email: 'wenyuanfeng@cosmo-lady.com.cn', username: 'wenyuanfeng', points: 0 },
    { email: '1458574484@qq.com', username: '1458574484', points: 0 },
    { email: 'chenyonga@cosmo-lady.com', username: 'chenyonga', points: 100 },
    { email: 'zhangdongliang@cosmo-lady.com', username: 'zhangdongliang', points: 30 },
    { email: 'liurence@cosmo-lady.com', username: 'liurence', points: 100 },
];

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createLegacyUsers() {
    console.log('='.repeat(60));
    console.log('🚀 批量创建阿里云遗留用户账号');
    console.log(`📧 默认密码: ${DEFAULT_PASSWORD}`);
    console.log('='.repeat(60));

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of legacyUsers) {
        try {
            // 使用 Admin API 创建用户（跳过邮箱验证）
            const { data, error } = await supabase.auth.admin.createUser({
                email: user.email,
                password: DEFAULT_PASSWORD,
                email_confirm: true, // 自动确认邮箱
                user_metadata: {
                    username: user.username,
                    display_name: user.username,
                    migrated_from: 'aliyun_lctmr_production'
                }
            });

            if (error) {
                if (error.message.includes('already been registered') || error.message.includes('already exists')) {
                    console.log(`⏭️  ${user.email} - 已存在，跳过`);
                    skipCount++;
                } else {
                    console.log(`❌ ${user.email} - 失败: ${error.message}`);
                    errorCount++;
                }
            } else {
                console.log(`✅ ${user.email} - 创建成功 (${user.points} 积分待恢复)`);
                successCount++;
            }
        } catch (err) {
            console.log(`❌ ${user.email} - 异常: ${err.message}`);
            errorCount++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 创建结果统计');
    console.log('='.repeat(60));
    console.log(`✅ 成功创建: ${successCount} 个`);
    console.log(`⏭️  已存在跳过: ${skipCount} 个`);
    console.log(`❌ 创建失败: ${errorCount} 个`);
    console.log(`📧 默认密码: ${DEFAULT_PASSWORD}`);
    console.log('\n⚠️  请通知用户首次登录后修改密码！');
}

createLegacyUsers().catch(console.error);
