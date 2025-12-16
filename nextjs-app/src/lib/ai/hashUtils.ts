/**
 * 内容哈希工具函数
 * 用于增量索引：通过哈希判断内容是否变化
 */
import * as crypto from 'crypto';

/**
 * 计算文本块的 SHA256 哈希值（截取前16位）
 * @param text - 文本内容
 * @returns 16位哈希字符串
 */
export function computeChunkHash(text: string): string {
    return crypto
        .createHash('sha256')
        .update(text.trim())
        .digest('hex')
        .slice(0, 16);
}

/**
 * 批量计算文本块的哈希值
 * @param chunks - 文本块数组
 * @returns 哈希值数组
 */
export function computeChunksHashes(chunks: string[]): string[] {
    return chunks.map(computeChunkHash);
}

/**
 * 比较新旧哈希，返回需要插入和删除的索引
 * @param existingHashes - 现有的哈希值列表（按 chunk_index 排序）
 * @param newHashes - 新计算的哈希值列表
 * @returns { toInsert: 需要新增的索引, toDelete: 需要删除的索引 }
 */
export function diffChunkHashes(
    existingHashes: string[],
    newHashes: string[]
): {
    toInsert: number[];
    toDelete: number[];
    unchanged: number[];
} {
    const toInsert: number[] = [];
    const toDelete: number[] = [];
    const unchanged: number[] = [];

    // 检查新 chunks
    newHashes.forEach((hash, index) => {
        const existingIndex = existingHashes.indexOf(hash);
        if (existingIndex === -1) {
            toInsert.push(index);
        } else {
            unchanged.push(index);
        }
    });

    // 检查需要删除的旧 chunks
    existingHashes.forEach((hash, index) => {
        if (!newHashes.includes(hash)) {
            toDelete.push(index);
        }
    });

    return { toInsert, toDelete, unchanged };
}
