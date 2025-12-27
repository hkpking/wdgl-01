/**
 * 表格向量化 API
 * POST /api/spreadsheet/embeddings
 */
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateEmbeddings } from '@/lib/ai/embeddingModel';
import { spreadsheetToText, chunkSpreadsheetText } from '@/lib/services/ai/spreadsheetAIService';
import crypto from 'crypto';

// 使用与搜索 API 相同的配置方式
const SUPABASE_DIRECT_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[SpreadsheetEmbedding] 警告: SUPABASE_SERVICE_ROLE_KEY 未配置');
}

const supabase = createClient(SUPABASE_DIRECT_URL, SUPABASE_SERVICE_ROLE_KEY || '', {
    auth: { persistSession: false },
});

function computeHash(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        const { spreadsheetId, userId, data, title, forceReindex = false } = await req.json();

        if (!spreadsheetId || !userId) {
            return Response.json({ error: '缺少必要参数' }, { status: 400 });
        }

        console.log(`[SpreadsheetEmbedding] 开始处理表格 ${spreadsheetId}`);

        // 将表格数据转换为文本
        const text = spreadsheetToText(data || [], title || '');

        if (!text || text.length < 10) {
            console.log('[SpreadsheetEmbedding] 内容太短，跳过向量化');
            return Response.json({ success: true, message: '内容太短，跳过向量化' });
        }

        // 计算内容哈希
        const contentHash = computeHash(text);

        // 检查是否需要重新索引
        if (!forceReindex) {
            const { data: existingEmb } = await supabase
                .from('spreadsheet_embeddings')
                .select('content_hash')
                .eq('spreadsheet_id', spreadsheetId)
                .limit(1);

            if (existingEmb && existingEmb.length > 0 && existingEmb[0].content_hash === contentHash) {
                console.log('[SpreadsheetEmbedding] 内容未变化，跳过');
                return Response.json({ success: true, message: '内容未变化' });
            }
        }

        // 删除旧的 embeddings
        await supabase
            .from('spreadsheet_embeddings')
            .delete()
            .eq('spreadsheet_id', spreadsheetId);

        // 分块
        const chunks = chunkSpreadsheetText(text, 500);
        console.log(`[SpreadsheetEmbedding] 分割为 ${chunks.length} 个块`);

        // 生成 embeddings
        const embeddings = await generateEmbeddings(chunks);

        // 存储
        const records = chunks.map((chunk, idx) => ({
            spreadsheet_id: spreadsheetId,
            chunk_index: idx,
            chunk_text: chunk,
            content_hash: contentHash,
            embedding: JSON.stringify(embeddings[idx]),  // 转为 JSON 字符串
            metadata: { title, user_id: userId },
        }));

        const { error: insertError } = await supabase
            .from('spreadsheet_embeddings')
            .insert(records);

        if (insertError) {
            console.error('[SpreadsheetEmbedding] 插入失败:', insertError);
            return Response.json({ error: insertError.message }, { status: 500 });
        }

        console.log(`[SpreadsheetEmbedding] 成功存储 ${records.length} 条向量`);

        return Response.json({
            success: true,
            chunksCount: chunks.length,
            message: `成功向量化 ${chunks.length} 个块`,
        });
    } catch (error: any) {
        console.error('[SpreadsheetEmbedding] 错误:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
