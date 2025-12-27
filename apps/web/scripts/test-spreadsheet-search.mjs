/**
 * 测试表格语义搜索
 */
import { createClient } from '@supabase/supabase-js';
import { generateSingleEmbedding } from '../src/lib/ai/embeddingModel.ts';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function testSearch() {
    const testQuery = '销售数据';
    console.log(`\n=== 测试语义搜索: "${testQuery}" ===\n`);

    try {
        // 调用本地 embedding 模型
        console.log('1. 生成查询向量...');
        const queryEmbedding = await generateSingleEmbedding(testQuery);
        console.log(`   向量维度: ${queryEmbedding.length}`);

        // 调用 RPC
        console.log('\n2. 调用 match_spreadsheets RPC...');
        const { data, error } = await supabase.rpc('match_spreadsheets', {
            query_embedding: JSON.stringify(queryEmbedding),
            match_threshold: 0.0,  // 极低阈值
            match_count: 10
        });

        if (error) {
            console.log('   ❌ RPC 失败:', error.message);
        } else {
            console.log(`   ✅ 返回 ${data?.length || 0} 条结果`);
            if (data?.length > 0) {
                console.log('\n   搜索结果:');
                data.forEach((r, i) => {
                    console.log(`   [${i + 1}] 相似度: ${(r.similarity * 100).toFixed(1)}%`);
                    console.log(`       ${r.chunk_text?.substring(0, 100)}...`);
                });
            }
        }
    } catch (err) {
        console.error('测试失败:', err);
    }
}

testSearch();
