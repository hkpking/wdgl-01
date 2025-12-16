#!/usr/bin/env node
/**
 * 验证文档向量化覆盖完整性
 * 
 * 使用: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/verify-embedding-coverage.mjs <document_id>
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

const documentId = process.argv[2];

async function verifyEmbeddingCoverage() {
    console.log('═══════════════════════════════════════════');
    console.log('📊 文档向量化覆盖验证工具');
    console.log('═══════════════════════════════════════════\n');

    // 如果没有指定文档 ID，列出最近的文档
    if (!documentId) {
        console.log('未指定文档 ID，列出最近的 10 个有向量化的文档:\n');

        const { data: docs } = await supabase
            .from('documents')
            .select('id, title, updated_at')
            .order('updated_at', { ascending: false })
            .limit(10);

        for (const doc of docs || []) {
            const { count } = await supabase
                .from('document_embeddings')
                .select('*', { count: 'exact', head: true })
                .eq('document_id', doc.id);

            if (count > 0) {
                console.log(`📄 ${doc.title || '无标题'}`);
                console.log(`   ID: ${doc.id}`);
                console.log(`   Chunks: ${count}`);
                console.log('');
            }
        }

        console.log('\n使用方式: node scripts/verify-embedding-coverage.mjs <document_id>');
        return;
    }

    // 1. 获取原始文档
    const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('id, title, content')
        .eq('id', documentId)
        .single();

    if (docError || !doc) {
        console.error('❌ 找不到文档:', documentId);
        return;
    }

    console.log(`📄 文档: "${doc.title}"`);
    console.log(`   ID: ${doc.id}`);

    // 提取纯文本 (与向量化时的处理一致)
    const plainText = doc.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    console.log(`   原文长度: ${plainText.length} 字符\n`);

    // 2. 获取所有 embeddings
    const { data: embeddings, error: embError } = await supabase
        .from('document_embeddings')
        .select('chunk_index, chunk_text')
        .eq('document_id', documentId)
        .order('chunk_index', { ascending: true });

    if (embError || !embeddings || embeddings.length === 0) {
        console.error('❌ 该文档没有向量化数据');
        return;
    }

    console.log(`📦 向量化 Chunks: ${embeddings.length} 个\n`);

    // 3. 分析覆盖情况
    let totalChunkChars = 0;
    let coveredPositions = new Set();

    for (const emb of embeddings) {
        totalChunkChars += emb.chunk_text.length;

        // 在原文中找到这个 chunk 的位置
        const pos = plainText.indexOf(emb.chunk_text.substring(0, 100)); // 用前100字符匹配
        if (pos !== -1) {
            for (let i = pos; i < pos + emb.chunk_text.length && i < plainText.length; i++) {
                coveredPositions.add(i);
            }
        }
    }

    const coverageRate = (coveredPositions.size / plainText.length * 100).toFixed(2);

    console.log('═══════════════════════════════════════════');
    console.log('📊 分析结果:');
    console.log('═══════════════════════════════════════════');
    console.log(`   原文长度:     ${plainText.length} 字符`);
    console.log(`   Chunks 总长:  ${totalChunkChars} 字符`);
    console.log(`   覆盖字符数:   ${coveredPositions.size} 字符`);
    console.log(`   覆盖率:       ${coverageRate}%`);
    console.log('');

    if (parseFloat(coverageRate) >= 95) {
        console.log('✅ 文档内容已完整向量化');
    } else if (parseFloat(coverageRate) >= 80) {
        console.log('⚠️ 文档大部分已向量化，可能有少量内容遗漏');
    } else {
        console.log('❌ 文档向量化不完整，建议重新保存文档触发向量化');
    }

    // 4. 显示各 chunk 预览
    console.log('\n📋 Chunks 预览:');
    console.log('───────────────────────────────────────────');

    for (const emb of embeddings.slice(0, 5)) { // 只显示前5个
        const preview = emb.chunk_text.substring(0, 80).replace(/\n/g, ' ');
        console.log(`[${emb.chunk_index}] ${preview}...`);
    }

    if (embeddings.length > 5) {
        console.log(`... 省略 ${embeddings.length - 5} 个 chunks`);
    }
}

verifyEmbeddingCoverage().catch(console.error);
