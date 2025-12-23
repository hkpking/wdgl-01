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

const SUPABASE_DIRECT_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_PROXY_URL = 'https://46.3.39.75:8443';
const useProxy = process.env.USE_SUPABASE_PROXY === 'true';
const SUPABASE_URL = useProxy ? SUPABASE_PROXY_URL : SUPABASE_DIRECT_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});


/**
 * 计算余弦相似度
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
}

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
            filters: explicitFilters,
            enableKnowledgeGraph = false,
            teamId,           // 团队过滤
            knowledgeBaseId,  // 知识库过滤
            documentId        // 文档过滤
        } = await req.json() as {
            query: string;
            userId?: string;
            topK?: number;
            threshold?: number;
            enableRerank?: boolean;
            enableCache?: boolean;
            filters?: SearchFilters;
            enableKnowledgeGraph?: boolean;
            teamId?: string;
            knowledgeBaseId?: string;
            documentId?: string;
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

        // 3.1 搜索文档
        const { data: docData, error: docError } = await supabase.rpc('match_documents', {
            query_embedding: JSON.stringify(queryEmbedding),
            match_threshold: 0.05, // 极低阈值，确保不遗漏
            match_count: candidateCount,
            p_user_id: userId || null
        });

        if (docError) {
            console.error('[Search] Document RPC error:', docError);
        }

        // 3.2 搜索表格 (使用真实向量检索)
        let spreadsheetResults: any[] = [];
        try {
            // 使用新创建的 match_spreadsheets RPC 函数
            const { data: sheetData, error: sheetError } = await supabase.rpc('match_spreadsheets', {
                query_embedding: JSON.stringify(queryEmbedding), // 384 dim embedding
                match_threshold: 0.1,  // 相似度阈值
                match_count: candidateCount,
                p_user_id: userId || null
            });

            if (sheetError) {
                // 如果函数不存在（迁移未执行），回退到旧逻辑或报错
                console.warn('[Search] 表格向量检索出错 (可能是 RPC 未创建):', sheetError);
            } else if (sheetData && sheetData.length > 0) {
                // 获取表格元数据（team_id, knowledge_base_id, title）
                const sheetIds = [...new Set(sheetData.map((r: any) => r.spreadsheet_id))];
                const { data: sheetMeta } = await supabase
                    .from('spreadsheets')
                    .select('id, title, team_id, knowledge_base_id')
                    .in('id', sheetIds);
                const sheetMetaMap = new Map((sheetMeta || []).map((s: any) => [s.id, s]));

                spreadsheetResults = sheetData.map((r: any) => {
                    const meta = sheetMetaMap.get(r.spreadsheet_id) || {};
                    return {
                        document_id: r.spreadsheet_id,
                        chunk_text: r.chunk_text,
                        similarity: r.similarity,
                        metadata: {
                            ...r.metadata,
                            title: meta.title || r.metadata?.title || '无标题表格',
                            type: 'spreadsheet',
                            team_id: meta.team_id,
                            knowledge_base_id: meta.knowledge_base_id
                        },
                        type: 'spreadsheet'
                    };
                });

                console.log(`[Search] 找到 ${spreadsheetResults.length} 条表格结果 (Vector Search)`);
            }
        } catch (sheetErr) {
            console.warn('[Search] 表格搜索失败:', sheetErr);
        }

        // 3.3 为文档结果添加元数据
        let enrichedDocResults = (docData || []).map((r: any) => ({ ...r, type: 'document' }));
        if (enrichedDocResults.length > 0) {
            const docIds = [...new Set(enrichedDocResults.map((r: any) => r.document_id))];
            const { data: docMeta } = await supabase
                .from('documents')
                .select('id, team_id, knowledge_base_id')
                .in('id', docIds);
            const docMetaMap = new Map((docMeta || []).map((d: any) => [d.id, d]));

            enrichedDocResults = enrichedDocResults.map((r: any) => {
                const meta = docMetaMap.get(r.document_id) || {};
                return {
                    ...r,
                    metadata: {
                        ...r.metadata,
                        team_id: meta.team_id,
                        knowledge_base_id: meta.knowledge_base_id
                    }
                };
            });
        }

        // 合并文档和表格结果
        const allResults = [
            ...enrichedDocResults,
            ...spreadsheetResults
        ];

        if (allResults.length === 0) {
            console.log('[Search] 无搜索结果');
            return Response.json({
                results: [],
                query: query.substring(0, 100),
                timeMs: Date.now() - startTime
            });
        }

        // 4. 混合排序：向量相似度 + 关键词匹配
        let results = allResults.map((r: any) => {
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

        // 6. 按团队/知识库/文档过滤（如果指定）
        let filteredResults = rerankedResults;
        if (documentId) {
            // 直接按文档 ID 过滤
            filteredResults = rerankedResults.filter((r: any) => r.document_id === documentId);
        } else if (teamId || knowledgeBaseId) {
            // 分离文档和表格结果
            const docResults = rerankedResults.filter((r: any) => r.type !== 'spreadsheet');
            const sheetResults = rerankedResults.filter((r: any) => r.type === 'spreadsheet');

            // 文档过滤：需要查询 documents 表获取关联信息
            let filteredDocs: any[] = [];
            const docIds = [...new Set(docResults.map((r: any) => r.document_id))];
            if (docIds.length > 0) {
                const { data: docs } = await supabase
                    .from('documents')
                    .select('id, team_id, knowledge_base_id')
                    .in('id', docIds);

                const docMap = new Map((docs || []).map((d: any) => [d.id, d]));

                filteredDocs = docResults.filter((r: any) => {
                    const doc = docMap.get(r.document_id);
                    if (!doc) return false;
                    if (knowledgeBaseId && doc.knowledge_base_id !== knowledgeBaseId) return false;
                    if (teamId && doc.team_id !== teamId) return false;
                    return true;
                });
            }

            // 表格过滤：直接使用 metadata 中的 team_id/knowledge_base_id
            const filteredSheets = sheetResults.filter((r: any) => {
                const meta = r.metadata || {};
                if (knowledgeBaseId && meta.knowledge_base_id !== knowledgeBaseId) return false;
                if (teamId && meta.team_id !== teamId) return false;
                return true;
            });

            // 合并并按原有排序保持
            const filteredSet = new Set([
                ...filteredDocs.map((r: any) => r.document_id),
                ...filteredSheets.map((r: any) => r.document_id)
            ]);
            filteredResults = rerankedResults.filter((r: any) => filteredSet.has(r.document_id));
        }

        // 7. 按文档去重（同一文档只保留最相关的 chunk）
        const seenDocs = new Set();
        const dedupedResults: any[] = [];
        for (const r of filteredResults) {
            if (!seenDocs.has(r.document_id)) {
                seenDocs.add(r.document_id);
                dedupedResults.push(r);
            }
            if (dedupedResults.length >= topK) break;
        }

        const timeMs = Date.now() - startTime;
        console.log(`[Search] 找到 ${allResults.length} 条原始结果, 去重后 ${dedupedResults.length} 条, 耗时 ${timeMs}ms`);

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

        // 8. 为每个结果添加匹配原因解释
        const resultsWithExplanation = dedupedResults.map((r: any) => {
            const reasons: string[] = [];

            // 添加分数来源说明
            if (r.rerankScore !== undefined && r.rerankScore > 0.7) {
                reasons.push('语义高度相关');
            } else if (r.similarity > 0.5) {
                reasons.push('内容相似');
            }

            if (r.keywordBoost > 0.3) {
                reasons.push('关键词匹配');
            }

            return {
                ...r,
                matchReason: reasons.length > 0 ? reasons.join('、') : '综合匹配'
            };
        });

        // 构建过滤条件提示
        const filterHints: string[] = [];
        if (mergedFilters.documentType) {
            filterHints.push(`类型:${mergedFilters.documentType}`);
        }
        if (mergedFilters.dateRange) {
            filterHints.push('时间筛选');
        }
        if (mergedFilters.department) {
            filterHints.push(`部门:${mergedFilters.department}`);
        }

        return Response.json({
            results: resultsWithExplanation,
            query: query.substring(0, 100),
            cached: false,
            reranked: enableRerank,
            timeMs,
            // 新增：搜索智能提示
            searchInsights: {
                appliedFilters: filterHints.length > 0 ? filterHints : null,
                knowledgeGraphUsed: enableKnowledgeGraph && knowledgeRelatedDocs.length > 0,
                expandedQuery: enableKnowledgeGraph && enhancedQuery !== query ? enhancedQuery : null,
                totalCandidates: allResults.length,
                rerankApplied: enableRerank && results.length > 2
            }
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
