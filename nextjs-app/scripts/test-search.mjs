#!/usr/bin/env node
/**
 * 测试语义搜索功能
 */

import { pipeline, env } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置
env.cacheDir = path.join(__dirname, '..', '.model-cache');
env.localModelPath = env.cacheDir;

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('请设置 SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

const query = process.argv[2] || '绩效指标设计';

async function testSearch() {
    console.log('═══════════════════════════════════════════');
    console.log('🔍 语义搜索测试');
    console.log('═══════════════════════════════════════════');
    console.log(`📝 查询: "${query}"`);
    console.log('');

    // 1. 生成查询向量
    console.log('⏳ 生成查询向量...');
    const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await pipe(query, { pooling: 'mean', normalize: true });
    const queryEmbedding = Array.from(output.data);
    console.log(`✅ 向量维度: ${queryEmbedding.length}`);
    console.log('');

    // 2. 调用 match_documents
    console.log('⏳ 执行相似度搜索...');
    const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.1, // 极低阈值，看所有结果
        match_count: 10,
        p_user_id: null
    });

    if (error) {
        console.error('❌ 搜索失败:', error);
        return;
    }

    console.log(`✅ 返回 ${data?.length || 0} 条结果`);
    console.log('');

    console.log('═══════════════════════════════════════════');
    console.log('📊 搜索结果:');
    console.log('═══════════════════════════════════════════');

    if (!data || data.length === 0) {
        console.log('❌ 没有找到任何结果。可能原因:');
        console.log('   1. 向量类型不匹配');
        console.log('   2. RPC 函数问题');
        return;
    }

    data.forEach((r, i) => {
        console.log(`\n[${i + 1}] 相似度: ${(r.similarity * 100).toFixed(1)}%`);
        console.log(`    标题: ${r.metadata?.title || '无标题'}`);
        console.log(`    内容: ${r.chunk_text.substring(0, 100)}...`);
    });
}

testSearch().catch(console.error);
