/**
 * 语义缓存层
 * 使用 LRU 缓存 + 向量相似度匹配
 * 用于减少重复查询的计算开销
 */

interface CacheEntry {
    queryVector: number[];
    queryText: string;
    results: any[];
    timestamp: number;
}

interface CacheStats {
    hits: number;
    misses: number;
    size: number;
}

class SemanticCache {
    private cache: Map<string, CacheEntry> = new Map();
    private maxSize: number;
    private ttl: number; // 毫秒
    private similarityThreshold: number;
    private stats: CacheStats = { hits: 0, misses: 0, size: 0 };

    constructor(options?: {
        maxSize?: number;
        ttlSeconds?: number;
        similarityThreshold?: number;
    }) {
        this.maxSize = options?.maxSize ?? 100;
        this.ttl = (options?.ttlSeconds ?? 3600) * 1000; // 默认 1 小时
        this.similarityThreshold = options?.similarityThreshold ?? 0.92;
    }

    /**
     * 计算两个向量的余弦相似度
     */
    private cosineSimilarity(a: number[], b: number[]): number {
        if (a.length !== b.length) return 0;

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
     * 生成缓存键（使用查询文本的简化形式）
     */
    private generateKey(queryText: string): string {
        return queryText.toLowerCase().trim().slice(0, 100);
    }

    /**
     * 清理过期条目
     */
    private cleanup(): void {
        const now = Date.now();
        const keysToDelete: string[] = [];

        this.cache.forEach((entry, key) => {
            if (now - entry.timestamp > this.ttl) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));
        this.stats.size = this.cache.size;
    }

    /**
     * 驱逐最旧的条目（LRU）
     */
    private evictOldest(): void {
        if (this.cache.size < this.maxSize) return;

        let oldestKey: string | null = null;
        let oldestTime = Infinity;

        this.cache.forEach((entry, key) => {
            if (entry.timestamp < oldestTime) {
                oldestTime = entry.timestamp;
                oldestKey = key;
            }
        });

        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * 查找语义相似的缓存结果
     * @param queryVector - 查询向量
     * @param queryText - 查询文本（用于精确匹配）
     * @returns 缓存的结果，如果未命中返回 null
     */
    get(queryVector: number[], queryText: string): any[] | null {
        this.cleanup();

        const key = this.generateKey(queryText);

        // 1. 尝试精确匹配
        const exactMatch = this.cache.get(key);
        if (exactMatch) {
            this.stats.hits++;
            exactMatch.timestamp = Date.now(); // 更新访问时间 (LRU)
            console.log(`[SemanticCache] 精确命中: "${queryText.slice(0, 30)}..."`);
            return exactMatch.results;
        }

        // 2. 尝试语义相似匹配
        const entries = Array.from(this.cache.entries());
        for (const [, entry] of entries) {
            const similarity = this.cosineSimilarity(queryVector, entry.queryVector);
            if (similarity >= this.similarityThreshold) {
                this.stats.hits++;
                entry.timestamp = Date.now(); // 更新访问时间
                console.log(`[SemanticCache] 语义命中 (${(similarity * 100).toFixed(1)}%): "${queryText.slice(0, 30)}..." ≈ "${entry.queryText.slice(0, 30)}..."`);
                return entry.results;
            }
        }

        this.stats.misses++;
        return null;
    }

    /**
     * 存储查询结果到缓存
     */
    set(queryVector: number[], queryText: string, results: any[]): void {
        this.evictOldest();

        const key = this.generateKey(queryText);
        this.cache.set(key, {
            queryVector,
            queryText,
            results,
            timestamp: Date.now()
        });

        this.stats.size = this.cache.size;
        console.log(`[SemanticCache] 缓存查询: "${queryText.slice(0, 30)}..." (size: ${this.cache.size})`);
    }

    /**
     * 清空缓存
     */
    clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, size: 0 };
    }

    /**
     * 获取缓存统计信息
     */
    getStats(): CacheStats & { hitRate: string } {
        const total = this.stats.hits + this.stats.misses;
        const hitRate = total > 0
            ? ((this.stats.hits / total) * 100).toFixed(1) + '%'
            : '0%';
        return { ...this.stats, hitRate };
    }

    /**
     * 使用户的缓存失效（当用户的文档更新时调用）
     */
    invalidateForUser(userId: string): void {
        // 简化实现：清空所有缓存
        // 生产环境应该只清除该用户相关的缓存
        this.clear();
        console.log(`[SemanticCache] 用户 ${userId} 的缓存已失效`);
    }
}

// 导出单例实例
export const semanticCache = new SemanticCache({
    maxSize: 200,
    ttlSeconds: 1800, // 30 分钟
    similarityThreshold: 0.92
});

// 导出类型供外部使用
export type { CacheEntry, CacheStats };
