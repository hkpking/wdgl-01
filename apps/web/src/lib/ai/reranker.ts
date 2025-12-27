/**
 * Re-ranking 服务
 * 使用 Cross-encoder 模型对搜索结果进行精排
 * 提高搜索精度
 */

import { pipeline } from '@xenova/transformers';

// Cross-encoder 模型实例（单例）
let rerankerPipeline: any = null;
let isLoading = false;
let loadingPromise: Promise<any> | null = null;

/**
 * 获取 Re-ranker Pipeline（单例模式）
 * 使用轻量级的 cross-encoder 模型
 */
async function getRerankerPipeline() {
    if (rerankerPipeline) {
        return rerankerPipeline;
    }

    if (isLoading && loadingPromise) {
        return loadingPromise;
    }

    isLoading = true;
    console.log('[Reranker] 初始化 Cross-encoder 模型...');

    loadingPromise = (async () => {
        try {
            const startTime = Date.now();
            // 使用轻量级的序列分类模型作为 reranker
            // 注意：这里使用 text-classification 任务类型
            rerankerPipeline = await pipeline(
                'text-classification',
                'Xenova/ms-marco-MiniLM-L-6-v2',
                { quantized: true } // 使用量化版本加速
            );
            const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[Reranker] 模型加载完成，耗时 ${loadTime}s`);
            return rerankerPipeline;
        } catch (error) {
            console.error('[Reranker] 模型加载失败:', error);
            // 如果模型加载失败，返回 null 让调用方降级处理
            return null;
        } finally {
            isLoading = false;
            loadingPromise = null;
        }
    })();

    return loadingPromise;
}

export interface RerankCandidate {
    chunk_text: string;
    similarity: number;
    document_id: string;
    metadata?: any;
    [key: string]: any;
}

export interface RerankResult extends RerankCandidate {
    rerankScore: number;
    originalRank: number;
    finalRank: number;
}

/**
 * 对搜索结果进行重排序
 * @param query - 用户查询
 * @param candidates - 候选结果列表
 * @param topK - 返回前 K 个结果
 * @returns 重排序后的结果
 */
export async function rerankResults(
    query: string,
    candidates: RerankCandidate[],
    topK: number = 5
): Promise<RerankResult[]> {
    if (candidates.length === 0) {
        return [];
    }

    // 如果候选结果很少，不需要重排
    if (candidates.length <= 2) {
        return candidates.map((c, i) => ({
            ...c,
            rerankScore: c.similarity,
            originalRank: i + 1,
            finalRank: i + 1
        }));
    }

    const startTime = Date.now();
    const reranker = await getRerankerPipeline();

    // 如果模型加载失败，降级到原始排序
    if (!reranker) {
        console.warn('[Reranker] 模型不可用，使用原始排序');
        return candidates.slice(0, topK).map((c, i) => ({
            ...c,
            rerankScore: c.similarity,
            originalRank: i + 1,
            finalRank: i + 1
        }));
    }

    try {
        // 构建 query-document pair 用于评分
        // Cross-encoder 输入格式: "query [SEP] document"
        const pairs = candidates.map(c => ({
            text: query,
            text_pair: c.chunk_text.slice(0, 512) // 限制长度避免超出模型限制
        }));

        // 批量计算相关性分数
        const scores = await reranker(pairs, {
            topk: null, // 获取所有类别的分数
        });

        // 提取相关性分数（通常是 label "LABEL_1" 的分数）
        const rerankScores = scores.map((s: any) => {
            // 模型返回格式: [{ label: "LABEL_0", score: 0.1 }, { label: "LABEL_1", score: 0.9 }]
            if (Array.isArray(s)) {
                const positiveScore = s.find((x: any) => x.label === 'LABEL_1');
                return positiveScore?.score ?? s[0]?.score ?? 0;
            }
            return s.score ?? 0;
        });

        // 合并分数并排序
        const resultsWithScores: RerankResult[] = candidates.map((c, i) => ({
            ...c,
            rerankScore: rerankScores[i],
            originalRank: i + 1,
            finalRank: 0 // 稍后填充
        }));

        // 按 rerank 分数排序
        resultsWithScores.sort((a, b) => b.rerankScore - a.rerankScore);

        // 填充最终排名
        resultsWithScores.forEach((r, i) => {
            r.finalRank = i + 1;
        });

        const rerankedTime = Date.now() - startTime;
        console.log(`[Reranker] 重排序完成，耗时 ${rerankedTime}ms，候选 ${candidates.length} 个`);

        // 打印排名变化
        resultsWithScores.slice(0, topK).forEach((r, i) => {
            const change = r.originalRank - r.finalRank;
            const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
            console.log(`  [${i + 1}] ${arrow}${Math.abs(change)} "${r.metadata?.title || '未知'}" (rerank: ${(r.rerankScore * 100).toFixed(1)}%)`);
        });

        return resultsWithScores.slice(0, topK);
    } catch (error) {
        console.error('[Reranker] 重排序失败:', error);
        // 降级到原始排序
        return candidates.slice(0, topK).map((c, i) => ({
            ...c,
            rerankScore: c.similarity,
            originalRank: i + 1,
            finalRank: i + 1
        }));
    }
}

/**
 * 预热 Reranker 模型（可选，用于服务启动时）
 */
export async function warmupReranker(): Promise<boolean> {
    console.log('[Reranker] 预热模型...');
    const reranker = await getRerankerPipeline();
    return reranker !== null;
}
