import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { generateEmbeddings } from '@/lib/ai/embeddingModel';
import { computeChunkHash, computeChunksHashes, diffChunkHashes } from '@/lib/ai/hashUtils';
import { semanticCache } from '@/lib/ai/semanticCache';

/**
 * Embedding API - 为文档生成向量 embedding
 * 使用本地 Xenova/all-MiniLM-L6-v2 模型 (384 维度)
 * 
 * 优化功能：
 * - 增量索引：通过内容哈希判断变化，只处理新增/修改的 chunks
 * - 缓存失效：更新索引时自动清理语义缓存
 */

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 创建 Supabase 服务端客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});


/**
 * 文档分块策略
 * - 按段落分割
 * - 每块最大 1000 字符
 * - 块之间有 100 字符重叠
 */
function chunkText(text: string, maxChars = 1000, overlap = 100): string[] {
    // 先清理 HTML 标签
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    if (!cleanText || cleanText.length === 0) {
        return [];
    }

    if (cleanText.length <= maxChars) {
        return [cleanText];
    }

    const chunks: string[] = [];
    let start = 0;
    const textLength = cleanText.length;

    // 安全阈值：最多生成的 chunk 数量（防止无限循环）
    const maxChunks = Math.ceil(textLength / (maxChars - overlap)) + 10;
    let iterations = 0;

    while (start < textLength && iterations < maxChunks) {
        iterations++;

        let end = Math.min(start + maxChars, textLength);

        // 尝试在句号、问号、感叹号或换行处断开
        if (end < textLength) {
            const searchText = cleanText.substring(start, end);
            const lastBreak = searchText.search(/[。！？\n.!?][^。！？\n.!?]*$/);
            // 只有在找到的断点位置合理时才使用
            if (lastBreak > maxChars / 2) {
                end = start + lastBreak + 1;
            }
        }

        const chunk = cleanText.slice(start, end).trim();
        if (chunk) {
            chunks.push(chunk);
        }

        // 计算下一个起始位置
        // 关键修复：确保 start 始终向前推进至少 (maxChars - overlap) 个字符
        const minAdvance = Math.max(1, maxChars - overlap);
        const nextStart = end - overlap;
        start = Math.max(nextStart, start + minAdvance);

        // 如果已经到达或超过末尾，退出
        if (start >= textLength) {
            break;
        }
    }

    if (iterations >= maxChunks) {
        console.warn(`[chunkText] Hit max iterations (${maxChunks}), text length: ${textLength}`);
    }

    return chunks;
}



export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const { documentId, userId, content, title, forceReindex = false } = await req.json();

        if (!documentId || !userId || !content) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const contentLength = content.length;
        console.log(`[Embedding] Processing doc: "${title}" (${contentLength} chars)${forceReindex ? ' [强制重建]' : ''}`);

        // 1. 分块
        const chunks = chunkText(content);
        if (chunks.length === 0) {
            // 空内容，删除所有现有 embeddings
            await supabase
                .from('document_embeddings')
                .delete()
                .eq('document_id', documentId);
            return Response.json({ success: true, chunksCreated: 0, timeMs: Date.now() - startTime });
        }

        // 2. 计算新 chunks 的哈希值
        const newHashes = computeChunksHashes(chunks);

        // 3. 获取现有 embeddings 的哈希值
        let existingHashes: string[] = [];
        let existingRecords: { id: string; chunk_index: number; content_hash?: string }[] = [];
        let hasContentHashColumn = true;

        if (!forceReindex) {
            try {
                const { data: existingData, error: fetchError } = await supabase
                    .from('document_embeddings')
                    .select('id, chunk_index, content_hash')
                    .eq('document_id', documentId)
                    .order('chunk_index', { ascending: true });

                if (fetchError) {
                    // 如果错误提示列不存在，降级到全量重建
                    if (fetchError.message.includes('content_hash') || fetchError.code === '42703') {
                        console.warn('[Embedding] content_hash 列不存在，降级到全量重建模式');
                        hasContentHashColumn = false;
                    } else {
                        console.error('[Embedding] 查询现有 embeddings 失败:', fetchError);
                    }
                } else if (existingData) {
                    existingRecords = existingData;
                    existingHashes = existingData.map(r => r.content_hash || '');
                }
            } catch (queryError) {
                console.warn('[Embedding] 查询失败，降级到全量重建:', queryError);
                hasContentHashColumn = false;
            }
        }

        // 4. 对比哈希，确定需要处理的 chunks
        // 如果没有 content_hash 列或者所有现有记录的哈希都为空，使用全量重建模式
        const useFullRebuild = forceReindex || !hasContentHashColumn || existingHashes.every(h => !h);

        const diff = useFullRebuild
            ? { toInsert: chunks.map((_, i) => i), toDelete: existingRecords.map((_, i) => i), unchanged: [] }
            : diffChunkHashes(existingHashes, newHashes);

        console.log(`[Embedding] ${useFullRebuild ? '全量重建' : '增量分析'}: ${diff.unchanged.length} 不变, ${diff.toInsert.length} 新增, ${diff.toDelete.length} 删除`);

        // 5. 删除过时的 chunks
        if (diff.toDelete.length > 0 && existingRecords.length > 0) {
            const idsToDelete = diff.toDelete
                .filter(i => i < existingRecords.length)
                .map(i => existingRecords[i].id);

            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('document_embeddings')
                    .delete()
                    .in('id', idsToDelete);

                if (deleteError) {
                    console.error('[Embedding] 删除旧 chunks 失败:', deleteError);
                }
            }
        }

        // 如果没有新增的 chunks，检查是否需要更新元数据（如标题变化）
        if (diff.toInsert.length === 0) {
            let metadataUpdated = false;

            // 检查标题是否变化（对比现有元数据中的标题）
            if (existingRecords.length > 0 && title) {
                // 获取第一条记录的当前元数据
                const { data: currentMeta } = await supabase
                    .from('document_embeddings')
                    .select('metadata')
                    .eq('document_id', documentId)
                    .limit(1)
                    .single();

                const currentTitle = currentMeta?.metadata?.title || '';

                // 只有标题变化时才更新
                if (currentTitle !== title) {
                    const { error: metaUpdateError } = await supabase
                        .from('document_embeddings')
                        .update({
                            metadata: { title: title, updatedAt: new Date().toISOString() }
                        })
                        .eq('document_id', documentId);

                    if (metaUpdateError) {
                        console.warn('[Embedding] 元数据更新失败:', metaUpdateError);
                    } else {
                        console.log(`[Embedding] ✅ 标题变化，元数据已更新: "${currentTitle}" → "${title}"`);
                        metadataUpdated = true;
                    }
                }
            }

            const timeMs = Date.now() - startTime;
            console.log(`[Embedding] ✅ 内容无变化 (${diff.unchanged.length} chunks) in ${timeMs}ms`);
            return Response.json({
                success: true,
                chunksCreated: 0,
                chunksUnchanged: diff.unchanged.length,
                metadataUpdated,
                timeMs,
                incremental: true
            });
        }

        // 6. 只处理需要新增/更新的 chunks
        const chunksToProcess = diff.toInsert.map(i => chunks[i]);
        const hashesToStore = diff.toInsert.map(i => newHashes[i]);

        console.log(`[Embedding] 处理 ${chunksToProcess.length} 个新 chunks...`);

        // 7. 分批处理
        const BATCH_SIZE = 50;
        const allRecords: any[] = [];

        for (let batchStart = 0; batchStart < chunksToProcess.length; batchStart += BATCH_SIZE) {
            const batchEnd = Math.min(batchStart + BATCH_SIZE, chunksToProcess.length);
            const batchChunks = chunksToProcess.slice(batchStart, batchEnd);
            const batchHashes = hashesToStore.slice(batchStart, batchEnd);
            const batchOriginalIndices = diff.toInsert.slice(batchStart, batchEnd);

            console.log(`[Embedding] 批次 ${Math.floor(batchStart / BATCH_SIZE) + 1}/${Math.ceil(chunksToProcess.length / BATCH_SIZE)} (${batchStart + 1}-${batchEnd})`);

            // 生成该批次的向量
            const batchEmbeddings = await generateEmbeddings(batchChunks);

            // 构建记录（当没有 content_hash 列时排除该字段）
            const batchRecords = batchChunks.map((chunk, i) => {
                const record: any = {
                    document_id: documentId,
                    user_id: userId,
                    chunk_index: batchOriginalIndices[i],
                    chunk_text: chunk,
                    embedding: JSON.stringify(batchEmbeddings[i]),
                    metadata: { title: title || 'Untitled', chunkIndex: batchOriginalIndices[i] }
                };
                // 仅当列存在时添加 content_hash
                if (hasContentHashColumn) {
                    record.content_hash = batchHashes[i];
                }
                return record;
            });

            allRecords.push(...batchRecords);
        }

        // 8. 批量写入数据库（使用 upsert 处理可能的冲突）
        const { error: insertError } = await supabase
            .from('document_embeddings')
            .upsert(allRecords, {
                onConflict: 'document_id,chunk_index',
                ignoreDuplicates: false
            });

        if (insertError) {
            console.error('[Embedding] DB Insert Error:', insertError);
            if (insertError.message.includes('dimensions')) {
                throw new Error('Database vector dimension mismatch. Please run the migration script.');
            }
            throw insertError;
        }

        // 9. 使语义缓存失效
        semanticCache.invalidateForUser(userId);

        const timeMs = Date.now() - startTime;
        console.log(`[Embedding] ✅ 增量更新完成: ${allRecords.length} 新增, ${diff.unchanged.length} 不变, ${diff.toDelete.length} 删除, 耗时 ${timeMs}ms`);

        return Response.json({
            success: true,
            chunksCreated: allRecords.length,
            chunksUnchanged: diff.unchanged.length,
            chunksDeleted: diff.toDelete.length,
            timeMs,
            incremental: true,
            stats: {
                originalLength: contentLength,
                totalChunks: chunks.length,
                processedChunks: chunksToProcess.length,
                batches: Math.ceil(chunksToProcess.length / BATCH_SIZE)
            }
        });

    } catch (error) {
        const timeMs = Date.now() - startTime;
        console.error('[Embedding] Error after', timeMs, 'ms:', error);
        return Response.json({
            error: error instanceof Error ? error.message : 'Internal server error',
            timeMs
        }, { status: 500 });
    }
}

