/**
 * Embedding 模型管理模块
 * 使用本地缓存的 @xenova/transformers 模型
 * 
 * 模型: Xenova/all-MiniLM-L6-v2 (384 维度)
 * 缓存目录: .model-cache/
 */

import { pipeline, env } from '@xenova/transformers';
import path from 'path';

// 配置模型缓存目录（项目内）
const MODEL_CACHE_DIR = process.env.TRANSFORMERS_CACHE ||
    path.join(process.cwd(), '.model-cache');

// 设置 @xenova/transformers 环境变量
env.cacheDir = MODEL_CACHE_DIR;
env.localModelPath = MODEL_CACHE_DIR;

// 可选：强制离线模式（需要先预下载模型）
// env.allowRemoteModels = false;

// 单例模式缓存 pipeline
let pipelineInstance: any = null;
let isLoading = false;
let loadingPromise: Promise<any> | null = null;

/**
 * 获取 Embedding Pipeline（单例模式）
 * 首次调用会下载/加载模型，后续调用直接返回缓存实例
 */
export async function getEmbeddingPipeline() {
    // 如果已有实例，直接返回
    if (pipelineInstance) {
        return pipelineInstance;
    }

    // 防止并发加载
    if (isLoading && loadingPromise) {
        return loadingPromise;
    }

    isLoading = true;
    console.log(`[EmbeddingModel] Initializing model...`);
    console.log(`[EmbeddingModel] Cache directory: ${MODEL_CACHE_DIR}`);

    loadingPromise = (async () => {
        try {
            const startTime = Date.now();
            pipelineInstance = await pipeline(
                'feature-extraction',
                'Xenova/all-MiniLM-L6-v2'
            );
            const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[EmbeddingModel] Model loaded successfully in ${loadTime}s`);
            return pipelineInstance;
        } catch (error) {
            console.error('[EmbeddingModel] Failed to load model:', error);
            throw error;
        } finally {
            isLoading = false;
            loadingPromise = null;
        }
    })();

    return loadingPromise;
}

/**
 * 生成文本的 Embedding 向量
 * @param texts - 文本数组
 * @returns 384 维向量数组
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const pipe = await getEmbeddingPipeline();
    const embeddings: number[][] = [];

    for (const text of texts) {
        try {
            // pooling: 'mean' 获取句子向量
            // normalize: true 归一化用于余弦相似度计算
            const output = await pipe(text, { pooling: 'mean', normalize: true });
            embeddings.push(Array.from(output.data));
        } catch (error) {
            console.error('[EmbeddingModel] Error generating embedding for text:', error);
            throw error;
        }
    }

    return embeddings;
}

/**
 * 生成单个文本的 Embedding 向量
 * @param text - 单个文本
 * @returns 384 维向量
 */
export async function generateSingleEmbedding(text: string): Promise<number[]> {
    const [embedding] = await generateEmbeddings([text]);
    return embedding;
}

/**
 * 预热模型（可选，用于服务器启动时预加载）
 */
export async function warmupModel(): Promise<void> {
    console.log('[EmbeddingModel] Warming up model...');
    await getEmbeddingPipeline();
    console.log('[EmbeddingModel] Model warmed up');
}

// 导出缓存目录路径（便于脚本使用）
export const MODEL_CACHE_PATH = MODEL_CACHE_DIR;
