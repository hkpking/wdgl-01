/**
 * 多模型 Embedding 池
 * 支持多个 Embedding 模型，根据文档类型和场景智能选择
 */

import { pipeline, env } from '@xenova/transformers';
import path from 'path';

// 配置模型缓存目录
const MODEL_CACHE_DIR = process.env.TRANSFORMERS_CACHE ||
    path.join(process.cwd(), '.model-cache');

env.cacheDir = MODEL_CACHE_DIR;
env.localModelPath = MODEL_CACHE_DIR;

/**
 * 模型配置接口
 */
export interface EmbeddingModelConfig {
    id: string;
    name: string;
    dimensions: number;
    maxTokens: number;
    priority: 'speed' | 'quality' | 'balanced';
    languages: string[];  // 支持的语言
    description: string;
}

/**
 * 可用模型池
 * 按优先级排序：speed > balanced > quality
 */
export const EMBEDDING_MODELS: EmbeddingModelConfig[] = [
    {
        id: 'all-MiniLM-L6-v2',
        name: 'Xenova/all-MiniLM-L6-v2',
        dimensions: 384,
        maxTokens: 256,
        priority: 'speed',
        languages: ['en', 'multi'],
        description: '轻量级通用模型，速度快'
    },
    {
        id: 'paraphrase-multilingual-MiniLM-L12-v2',
        name: 'Xenova/paraphrase-multilingual-MiniLM-L12-v2',
        dimensions: 384,
        maxTokens: 128,
        priority: 'balanced',
        languages: ['zh', 'en', 'multi'],
        description: '多语言模型，中文支持更好'
    },
    // 注意：以下模型需要更大的资源，可选启用
    // {
    //     id: 'bge-small-zh-v1.5',
    //     name: 'BAAI/bge-small-zh-v1.5',
    //     dimensions: 512,
    //     maxTokens: 512,
    //     priority: 'quality',
    //     languages: ['zh'],
    //     description: '中文专用高质量模型'
    // }
];

// 模型实例缓存
const modelCache: Map<string, any> = new Map();
const loadingPromises: Map<string, Promise<any>> = new Map();

/**
 * 获取指定模型的 Pipeline
 * @param modelId - 模型 ID
 */
async function getModelPipeline(modelId: string): Promise<any> {
    // 检查缓存
    if (modelCache.has(modelId)) {
        return modelCache.get(modelId);
    }

    // 检查是否正在加载
    if (loadingPromises.has(modelId)) {
        return loadingPromises.get(modelId);
    }

    const config = EMBEDDING_MODELS.find(m => m.id === modelId);
    if (!config) {
        throw new Error(`Unknown model: ${modelId}`);
    }

    console.log(`[EmbeddingPool] Loading model: ${config.name}...`);

    const loadPromise = (async () => {
        try {
            const startTime = Date.now();
            const pipe = await pipeline('feature-extraction', config.name);
            const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`[EmbeddingPool] Model ${config.id} loaded in ${loadTime}s`);
            modelCache.set(modelId, pipe);
            return pipe;
        } catch (error) {
            console.error(`[EmbeddingPool] Failed to load model ${modelId}:`, error);
            throw error;
        } finally {
            loadingPromises.delete(modelId);
        }
    })();

    loadingPromises.set(modelId, loadPromise);
    return loadPromise;
}

/**
 * 智能模型选择器
 * 根据文档类型、语言和内容长度选择最佳模型
 */
export function selectBestModel(options: {
    docType?: string;
    language?: 'zh' | 'en' | 'multi';
    contentLength?: number;
    priority?: 'speed' | 'quality' | 'balanced';
}): EmbeddingModelConfig {
    const { docType, language = 'zh', contentLength = 0, priority = 'balanced' } = options;

    // 过滤支持当前语言的模型
    let candidates = EMBEDDING_MODELS.filter(m =>
        m.languages.includes(language) || m.languages.includes('multi')
    );

    if (candidates.length === 0) {
        candidates = EMBEDDING_MODELS;
    }

    // 根据优先级排序
    if (priority === 'speed') {
        candidates.sort((a, b) => {
            const order = { speed: 0, balanced: 1, quality: 2 };
            return order[a.priority] - order[b.priority];
        });
    } else if (priority === 'quality') {
        candidates.sort((a, b) => {
            const order = { quality: 0, balanced: 1, speed: 2 };
            return order[a.priority] - order[b.priority];
        });
    }

    // 对于重要文档类型，倾向使用高质量模型
    if (docType === 'policy' || docType === 'regulation') {
        const qualityModel = candidates.find(m => m.priority === 'quality' || m.priority === 'balanced');
        if (qualityModel) return qualityModel;
    }

    return candidates[0];
}

/**
 * 使用指定模型生成 Embedding
 * @param texts - 文本数组
 * @param modelId - 模型 ID（可选，默认使用默认模型）
 */
export async function generateEmbeddingsWithModel(
    texts: string[],
    modelId: string = 'all-MiniLM-L6-v2'
): Promise<{ embeddings: number[][]; modelId: string; dimensions: number }> {
    const config = EMBEDDING_MODELS.find(m => m.id === modelId);
    if (!config) {
        throw new Error(`Unknown model: ${modelId}`);
    }

    const pipe = await getModelPipeline(modelId);
    const embeddings: number[][] = [];

    for (const text of texts) {
        try {
            const output = await pipe(text, { pooling: 'mean', normalize: true });
            embeddings.push(Array.from(output.data));
        } catch (error) {
            console.error(`[EmbeddingPool] Error generating embedding:`, error);
            throw error;
        }
    }

    return {
        embeddings,
        modelId: config.id,
        dimensions: config.dimensions
    };
}

/**
 * 智能生成 Embedding（自动选择最佳模型）
 */
export async function generateSmartEmbeddings(
    texts: string[],
    options?: {
        docType?: string;
        language?: 'zh' | 'en' | 'multi';
        priority?: 'speed' | 'quality' | 'balanced';
    }
): Promise<{ embeddings: number[][]; modelId: string; dimensions: number }> {
    const bestModel = selectBestModel({
        ...options,
        contentLength: texts.reduce((sum, t) => sum + t.length, 0)
    });

    console.log(`[EmbeddingPool] Selected model: ${bestModel.id} (${bestModel.description})`);

    return generateEmbeddingsWithModel(texts, bestModel.id);
}

/**
 * 获取当前已加载的模型列表
 */
export function getLoadedModels(): string[] {
    return Array.from(modelCache.keys());
}

/**
 * 获取模型配置
 */
export function getModelConfig(modelId: string): EmbeddingModelConfig | undefined {
    return EMBEDDING_MODELS.find(m => m.id === modelId);
}

/**
 * 预热指定模型
 */
export async function warmupModel(modelId: string): Promise<boolean> {
    try {
        await getModelPipeline(modelId);
        return true;
    } catch {
        return false;
    }
}

/**
 * 预热所有模型（可选，启动时调用）
 */
export async function warmupAllModels(): Promise<void> {
    console.log('[EmbeddingPool] Warming up all models...');
    for (const model of EMBEDDING_MODELS) {
        try {
            await warmupModel(model.id);
        } catch (error) {
            console.warn(`[EmbeddingPool] Failed to warmup ${model.id}:`, error);
        }
    }
    console.log('[EmbeddingPool] All models warmed up');
}
