/**
 * 检查 Supabase 表结构
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTables() {
    console.log('检查 Supabase 表结构...\n');

    // 尝试获取表的一行数据来了解结构
    const tables = ['lctmr_profiles', 'lctmr_factions', 'lctmr_achievements', 'lctmr_categories', 'lctmr_chapters', 'lctmr_sections', 'lctmr_blocks'];

    for (const table of tables) {
        console.log(`\n=== ${table} ===`);
        try {
            const { data, error, status } = await supabase
                .from(table)
                .select('*')
                .limit(1);

            if (error) {
                console.log(`状态: ${status}`);
                console.log(`错误: ${error.message}`);
                console.log(`详情: ${error.details || 'N/A'}`);
            } else {
                console.log(`状态: OK`);
                if (data && data.length > 0) {
                    console.log(`列: ${Object.keys(data[0]).join(', ')}`);
                } else {
                    console.log(`表存在但为空`);
                }
            }
        } catch (err) {
            console.log(`异常: ${err.message}`);
        }
    }
}

checkTables().catch(console.error);
