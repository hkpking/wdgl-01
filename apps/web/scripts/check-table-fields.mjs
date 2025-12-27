/**
 * 检查 comments 和 versions 表的详细字段
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('📋 检查表字段结构\n');

    // 通过插入一条临时记录来查看表结构
    // 先尝试 select 使用 * 获取所有字段

    // 检查 comments 表需要的新字段
    const requiredCommentFields = ['target_type', 'target_id', 'cell_row', 'cell_col', 'page_number'];
    const requiredVersionFields = ['target_type', 'target_id', 'created_by_uid'];

    console.log('📝 comments 表检查:');
    for (const field of requiredCommentFields) {
        try {
            const { error } = await supabase.from('comments').select(field).limit(1);
            if (error && error.message.includes('does not exist')) {
                console.log(`  ❌ ${field} 字段不存在`);
            } else if (error) {
                console.log(`  ⚠️ ${field}: ${error.message}`);
            } else {
                console.log(`  ✅ ${field} 字段存在`);
            }
        } catch (e) {
            console.log(`  ⚠️ ${field}: 检查失败`);
        }
    }

    console.log('\n📜 versions 表检查:');
    for (const field of requiredVersionFields) {
        try {
            const { error } = await supabase.from('versions').select(field).limit(1);
            if (error && error.message.includes('does not exist')) {
                console.log(`  ❌ ${field} 字段不存在`);
            } else if (error) {
                console.log(`  ⚠️ ${field}: ${error.message}`);
            } else {
                console.log(`  ✅ ${field} 字段存在`);
            }
        } catch (e) {
            console.log(`  ⚠️ ${field}: 检查失败`);
        }
    }
}

main().catch(console.error);
