/**
 * @file cache.js
 * @description 本地缓存服务，用于减少重复请求和提升加载性能
 */

export class CacheService {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5分钟默认过期时间
        this.maxCacheSize = 50; // 最大缓存条目数
    }

    // 生成缓存键
    generateKey(url, params = {}) {
        const paramString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${url}${paramString ? `?${paramString}` : ''}`;
    }

    // 设置缓存
    set(key, data, ttl = this.defaultTTL) {
        // 如果缓存已满，删除最旧的条目
        if (this.cache.size >= this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.delete(oldestKey);
        }

        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
    }

    // 获取缓存
    get(key) {
        const expiry = this.cacheExpiry.get(key);

        // 检查是否过期
        if (expiry && Date.now() > expiry) {
            this.delete(key);
            return null;
        }

        return this.cache.get(key) || null;
    }

    // 删除缓存
    delete(key) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
    }

    // 清空所有缓存
    clear() {
        this.cache.clear();
        this.cacheExpiry.clear();
    }

    // 检查缓存是否存在且有效
    has(key) {
        const expiry = this.cacheExpiry.get(key);
        if (expiry && Date.now() > expiry) {
            this.delete(key);
            return false;
        }
        return this.cache.has(key);
    }

    // 获取缓存统计信息
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            keys: Array.from(this.cache.keys())
        };
    }

    // 预加载关键数据
    async preloadCriticalData(apiService) {
        // 检查是否使用 Supabase 直连模式（没有 request 方法）
        if (!apiService.db || !apiService.db.request) {
            return;
        }

        const criticalEndpoints = [
            { url: '/api/learning/map', key: 'learning-map' },
            { url: '/api/learning/factions', key: 'factions' },
            { url: '/api/learning/leaderboard', key: 'leaderboard' }
        ];

        const preloadPromises = criticalEndpoints.map(async ({ url, key }) => {
            try {
                if (!this.has(key)) {
                    const data = await apiService.db.request(url);
                    this.set(key, data, 10 * 60 * 1000); // 10分钟缓存
                } else {
                }
            } catch (error) {
                console.warn(`⚠️ 预加载失败: ${key}`, error);
            }
        });

        await Promise.allSettled(preloadPromises);
    }


    // 智能缓存策略
    getCacheStrategy(endpoint) {
        const strategies = {
            '/api/user/profile': { ttl: 2 * 60 * 1000 }, // 2分钟
            '/api/learning/progress': { ttl: 1 * 60 * 1000 }, // 1分钟
            '/api/learning/map': { ttl: 10 * 60 * 1000 }, // 10分钟
            '/api/learning/factions': { ttl: 30 * 60 * 1000 }, // 30分钟
            '/api/learning/leaderboard': { ttl: 2 * 60 * 1000 }, // 2分钟
            '/api/learning/challenges': { ttl: 5 * 60 * 1000 }, // 5分钟
        };

        return strategies[endpoint] || { ttl: this.defaultTTL };
    }
}

// 创建全局缓存实例
export const cacheService = new CacheService();
