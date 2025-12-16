import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { generateSingleEmbedding } from '@/lib/ai/embeddingModel';
import { semanticCache } from '@/lib/ai/semanticCache';
import { rerankResults, type RerankCandidate } from '@/lib/ai/reranker';
import {
    extractImplicitFilters,
    mergeFilters,
    formatFiltersForLog,
    type SearchFilters
} from '@/lib/ai/searchFilters';
import { enhanceQueryWithKnowledge } from '@/lib/ai/knowledgeGraph';

/**
 * 语义搜索 API - 增强版 v2
 * 
 * 优化功能：
 * - 语义缓存：相似查询直接返回缓存结果
 * - 混合搜索：向量相似度 + 关键词匹配
 * - Re-ranking：Cross-encoder 精排提高精度
 * - 元数据过滤：支持文档类型、时间、部门等过滤
 * - 知识图谱：实体关系增强检索
 */

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

/**
 * 计算关键词匹配分数（支持中文）
 * 检查 chunk 是否包含查询中的关键词
 */
function calculateKeywordBoost(query: string, chunkText: string): number {
    // 清理查询文本
    const cleanQuery = query.replace(/[？?！!。，,\s]+/g, '').toLowerCase();
    const cleanChunk = chunkText.toLowerCase();

    if (cleanQuery.length < 2) return 0;

    let boost = 0;

    // 1. 完整查询匹配（最高权重）
    if (cleanChunk.includes(cleanQuery)) {
        boost += 0.5;
    }

    // 2. 分词匹配（按空格分割 + 提取2-4字关键词）
    const keywords = new Set<string>();

    // 按空格分割
    query.split(/\s+/).filter(k => k.length >= 2).forEach(k => keywords.add(k));

    // 提取中文片段（2-4字）
    for (let len = 4; len >= 2; len--) {
        for (let i = 0; i <= cleanQuery.length - len; i++) {
            const segment = cleanQuery.substring(i, i + len);
            if (/[\u4e00-\u9fff]{2,}/.test(segment)) { // 至少2个中文字符
                keywords.add(segment);
            }
        }
    }

    // 计算匹配
    for (const keyword of keywords) {
        if (cleanChunk.includes(keyword)) {
            boost += 0.15; // 每个关键词增加 0.15
        }
    }

    return Math.min(boost, 1.0); // 最高不超过 1.0
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const {
            query,
            userId,
            topK = 5,
            threshold = 0.1,
            enableRerank = true,
            enableCache = true,
            filters: explicitFilters,      // 显式过滤条件
            enableKnowledgeGraph = false   // 是否启用知识图谱增强
        } = await req.json() as {
            query: string;
            userId?: string;
            topK?: number;
            threshold?: number;
            enableRerank?: boolean;
            enableCache?: boolean;
            filters?: SearchFilters;
            enableKnowledgeGraph?: boolean;
        };

        if (!query) {
            return Response.json(
                { error: 'Missing required field: query' },
                { status: 400 }
            );
        }

        console.log(`[Search] Query: "${query.substring(0, 50)}..." (rerank: ${enableRerank}, cache: ${enableCache})`);

        // 1. 提取隐式过滤条件并合并
        const implicitFilters = extractImplicitFilters(query);
        const mergedFilters = mergeFilters(explicitFilters, implicitFilters);
        console.log(`[Search] 过滤条件: ${formatFiltersForLog(mergedFilters)}`);

        // 2. 知识图谱增强（可选）
        let enhancedQuery = query;
        let knowledgeRelatedDocs: string[] = [];
        if (enableKnowledgeGraph) {
            const kgResult = enhanceQueryWithKnowledge(query);
            enhancedQuery = kgResult.expandedQuery;
            knowledgeRelatedDocs = kgResult.relatedDocIds;
        }

        // 3. 生成查询向量
        const queryEmbedding = await generateSingleEmbedding(enhancedQuery);

        // 4. 检查语义缓存
        if (enableCache) {
            const cachedResults = semanticCache.get(queryEmbedding, query);
            if (cachedResults) {
                const cacheStats = semanticCache.getStats();
                console.log(`[Search] 缓存命中! (命中率: ${cacheStats.hitRate})`);
                return Response.json({
                    results: cachedResults,
                    query: query.substring(0, 100),
                    cached: true,
                    timeMs: Date.now() - startTime
                });
            }
        }

        // 3. 数据库相似度搜索（获取更多候选用于 Re-ranking）
        const candidateCount = enableRerank ? 20 : topK * 2;
        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: JSON.stringify(queryEmbedding),
            match_threshold: 0.05, // 极低阈值，确保不遗漏
            match_count: candidateCount,
            p_user_id: userId || null
        });

        if (error) {
            console.error('[Search] RPC error:', error);
            return Response.json(
                { error: `Search failed: ${error.message}` },
                { status: 500 }
            );
        }

        if (!data || data.length === 0) {
            console.log('[Search] 无搜索结果');
            return Response.json({
                results: [],
                query: query.substring(0, 100),
                timeMs: Date.now() - startTime
            });
        }

        // 4. 混合排序：向量相似度 + 关键词匹配
        let results = (data || []).map((r: any) => {
            const keywordBoost = calculateKeywordBoost(query, r.chunk_text);
            const hybridScore = r.similarity + keywordBoost;
            return { ...r, keywordBoost, hybridScore };
        });

        // 按混合分数排序
        results.sort((a: any, b: any) => b.hybridScore - a.hybridScore);

        // 5. Re-ranking（可选）
        let rerankedResults = results;
        if (enableRerank && results.length > 2) {
            try {
                const candidates: RerankCandidate[] = results.map((r: any) => ({
                    ...r,
                    chunk_text: r.chunk_text,
                    similarity: r.hybridScore, // 使用混合分数作为初始分数
                    document_id: r.document_id,
                    metadata: r.metadata
                }));

                rerankedResults = await rerankResults(query, candidates, topK * 2);
                console.log(`[Search] Re-ranking 完成`);
            } catch (rerankError) {
                console.warn('[Search] Re-ranking 失败，使用原始排序:', rerankError);
                rerankedResults = results;
            }
        }

        // 6. 按文档去重（同一文档只保留最相关的 chunk）
        const seenDocs = new Set();
        const dedupedResults: any[] = [];
        for (const r of rerankedResults) {
            if (!seenDocs.has(r.document_id)) {
                seenDocs.add(r.document_id);
                dedupedResults.push(r);
            }
            if (dedupedResults.length >= topK) break;
        }

        const timeMs = Date.now() - startTime;
        console.log(`[Search] 找到 ${data.length} 条原始结果, 去重后 ${dedupedResults.length} 条, 耗时 ${timeMs}ms`);

        // 详细日志
        dedupedResults.forEach((r: any, i: number) => {
            const score = r.rerankScore !== undefined
                ? `rerank: ${(r.rerankScore * 100).toFixed(1)}%`
                : `hybrid: ${(r.hybridScore * 100).toFixed(1)}%`;
            console.log(`  [${i + 1}] "${r.metadata?.title}" (${score})`);
        });

        // 7. 存入语义缓存
        if (enableCache) {
            semanticCache.set(queryEmbedding, query, dedupedResults);
        }

        return Response.json({
            results: dedupedResults,
            query: query.substring(0, 100),
            cached: false,
            reranked: enableRerank,
            timeMs
        });

    } catch (error) {
        const timeMs = Date.now() - startTime;
        console.error('[Search] Error after', timeMs, 'ms:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET 请求：获取缓存统计信息
 */
export async function GET() {
    const stats = semanticCache.getStats();
    return Response.json({
        cache: stats,
        status: 'ok'
    });
}
