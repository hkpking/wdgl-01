#!/usr/bin/env node
/**
 * 预下载 Embedding 模型脚本
 * 
 * 用途:
 * - CI/CD 构建时预下载模型
 * - 首次部署前准备模型文件
 * - 离线环境准备
 * 
 * 使用: npm run download-model
 */

import { pipeline, env } from '@xenova/transformers';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '..', '.model-cache');

// 配置缓存目录
env.cacheDir = CACHE_DIR;
env.localModelPath = CACHE_DIR;

console.log('═══════════════════════════════════════════');
console.log('📥 Embedding Model Downloader');
console.log('═══════════════════════════════════════════');
console.log(`📁 Cache directory: ${CACHE_DIR}`);
console.log('');

// 确保缓存目录存在
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log('✅ Created cache directory');
}

async function downloadModel() {
    const startTime = Date.now();

    console.log('⏳ Downloading model: Xenova/all-MiniLM-L6-v2');
    console.log('   (This may take a few minutes on first run...)');
    console.log('');

    try {
        const pipe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

        // 测试模型
        const testResult = await pipe('Hello world', { pooling: 'mean', normalize: true });
        const dimensions = testResult.data.length;

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log(`✅ Model downloaded successfully!`);
        console.log(`   ⏱️  Time: ${elapsed}s`);
        console.log(`   📐 Dimensions: ${dimensions}`);
        console.log('═══════════════════════════════════════════');

        // 列出缓存内容
        const files = fs.readdirSync(CACHE_DIR);
        console.log('');
        console.log('📂 Cache contents:');
        files.forEach(f => console.log(`   - ${f}`));

    } catch (error) {
        console.error('');
        console.error('❌ Failed to download model:', error);
        process.exit(1);
    }
}

downloadModel();
