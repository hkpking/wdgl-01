/**
 * 诊断表格向量搜索功能的数据库状态
 * 检查:
 * 1. match_spreadsheets RPC 是否存在
 * 2. spreadsheet_embeddings 表是否有数据
 * 3. 向量格式是否正确
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function diagnose() {
    console.log('=== 表格向量搜索诊断 ===\n');

    // 1. 检查 spreadsheets 表
    console.log('1. 检查 spreadsheets 表...');
    const { data: sheets, error: sheetsErr } = await supabase
        .from('spreadsheets')
        .select('id, title, updated_at')
        .limit(5);

    if (sheetsErr) {
        console.log('   ❌ 查询失败:', sheetsErr.message);
    } else {
        console.log(`   ✅ 找到 ${sheets?.length || 0} 个表格`);
        if (sheets?.length > 0) {
            sheets.forEach(s => console.log(`      - ${s.title} (${s.id})`));
        }
    }

    // 2. 检查 spreadsheet_embeddings 表
    console.log('\n2. 检查 spreadsheet_embeddings 表...');
    const { data: embeds, error: embedsErr, count } = await supabase
        .from('spreadsheet_embeddings')
        .select('id, spreadsheet_id, chunk_index, chunk_text', { count: 'exact' })
        .limit(3);

    if (embedsErr) {
        console.log('   ❌ 查询失败:', embedsErr.message);
    } else {
        console.log(`   ✅ 向量记录数: ${count || embeds?.length || 0}`);
        if (embeds?.length > 0) {
            console.log('   示例数据:');
            embeds.forEach(e => {
                console.log(`      - 表格 ${e.spreadsheet_id}, 块 ${e.chunk_index}`);
                console.log(`        文本: ${e.chunk_text?.substring(0, 80)}...`);
            });
        } else {
            console.log('   ⚠️  表格向量表为空！这就是搜索不到表格的原因');
        }
    }

    // 3. 检查向量格式
    console.log('\n3. 检查向量格式...');
    const { data: vectorSample, error: vecErr } = await supabase
        .from('spreadsheet_embeddings')
        .select('id, embedding')
        .limit(1);

    if (vecErr) {
        console.log('   ❌ 查询失败:', vecErr.message);
    } else if (vectorSample?.length > 0) {
        const embedding = vectorSample[0].embedding;
        const embeddingType = typeof embedding;
        const isArray = Array.isArray(embedding);
        console.log(`   向量类型: ${embeddingType}, 是数组: ${isArray}`);
        if (isArray) {
            console.log(`   向量维度: ${embedding.length}`);
        } else if (embeddingType === 'string') {
            try {
                const parsed = JSON.parse(embedding);
                console.log(`   ⚠️  向量存储为 JSON 字符串，维度: ${parsed.length}`);
            } catch {
                console.log(`   ❌ 向量格式异常`);
            }
        }
    } else {
        console.log('   ⚠️  无向量数据可检查');
    }

    // 4. 测试 match_spreadsheets RPC
    console.log('\n4. 测试 match_spreadsheets RPC...');
    // 创建一个假的查询向量 (384维)
    const testEmbedding = Array(384).fill(0.01);
    const { data: matchResult, error: matchErr } = await supabase.rpc('match_spreadsheets', {
        query_embedding: JSON.stringify(testEmbedding),
        match_threshold: 0.0,  // 极低阈值
        match_count: 5
    });

    if (matchErr) {
        console.log('   ❌ RPC 调用失败:', matchErr.message);
        console.log('   可能原因: RPC 函数未创建或参数格式错误');
    } else {
        console.log(`   ✅ RPC 正常工作，返回 ${matchResult?.length || 0} 条结果`);
    }

    // 5. 对比检查 document_embeddings
    console.log('\n5. 对比: document_embeddings 表...');
    const { count: docEmbCount } = await supabase
        .from('document_embeddings')
        .select('*', { count: 'exact', head: true });

    console.log(`   文档向量记录数: ${docEmbCount || 0}`);

    console.log('\n=== 诊断完成 ===');
}

diagnose().catch(console.error);
