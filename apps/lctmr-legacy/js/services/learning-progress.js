/**
 * @file learning-progress.js
 * @description 学习进度管理服务 - 处理碎片式学习和数据持久化
 * @version 1.0.0
 * @author LCTMR Team
 */

import { ApiService } from './api.js';

/**
 * 学习进度管理器
 * 负责管理用户的碎片式学习进度，支持本地和服务器同步
 */
export class LearningProgressManager {
    constructor() {
        this.syncInProgress = new Set(); // 正在同步的内容块
        this.cache = new Map(); // 本地缓存
        this.maxRetries = 3; // 最大重试次数
        this.syncInterval = 30000; // 30秒同步一次
        this.autoSyncTimer = null;
        
    }

    /**
     * 启动自动同步
     */
    startAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
        }
        
        this.autoSyncTimer = setInterval(() => {
            this.syncPendingProgress();
        }, this.syncInterval);
        
    }

    /**
     * 停止自动同步
     */
    stopAutoSync() {
        if (this.autoSyncTimer) {
            clearInterval(this.autoSyncTimer);
            this.autoSyncTimer = null;
        }
    }

    /**
     * 获取学习进度
     * @param {string} blockId - 内容块ID
     * @param {boolean} forceRefresh - 是否强制从服务器刷新
     * @returns {Promise<Object|null>} 学习进度数据
     */
    async getProgress(blockId, forceRefresh = false) {
        try {
            // 检查缓存
            if (!forceRefresh && this.cache.has(blockId)) {
                const cached = this.cache.get(blockId);
                if (Date.now() - cached.timestamp < 60000) { // 1分钟缓存
                    return cached.data;
                }
            }

            // 从服务器获取
            let serverProgress = null;
            try {
                const userId = window.AppState?.user?.id;
                if (userId && window.ApiService) {
                    const response = await ApiService.getConversationProgress(userId, blockId);
                    if (response && response.success && response.data) {
                        serverProgress = response.data;
                    }
                }
            } catch (error) {
                console.warn('从服务器获取进度失败，尝试本地存储:', error);
            }

            // 如果服务器没有数据，尝试本地存储
            if (!serverProgress) {
                const localKey = `conversation_progress_${blockId}`;
                const localData = localStorage.getItem(localKey);
                if (localData) {
                    serverProgress = JSON.parse(localData);
                }
            }

            // 缓存结果
            if (serverProgress) {
                this.cache.set(blockId, {
                    data: serverProgress,
                    timestamp: Date.now()
                });
            }

            return serverProgress;
        } catch (error) {
            console.error('获取学习进度失败:', error);
            return null;
        }
    }

    /**
     * 保存学习进度
     * @param {Object} progressData - 进度数据
     * @param {boolean} immediate - 是否立即同步到服务器
     * @returns {Promise<boolean>} 保存是否成功
     */
    async saveProgress(progressData, immediate = false) {
        try {
            const { blockId } = progressData;
            
            // 更新缓存
            this.cache.set(blockId, {
                data: progressData,
                timestamp: Date.now()
            });

            // 保存到本地存储（确保数据不丢失）
            const localKey = `conversation_progress_${blockId}`;
            localStorage.setItem(localKey, JSON.stringify(progressData));
            
            // 标记为待同步
            this.markForSync(blockId, progressData);

            // 如果需要立即同步
            if (immediate) {
                await this.syncToServer(blockId, progressData);
            }

            return true;
        } catch (error) {
            console.error('保存学习进度失败:', error);
            return false;
        }
    }

    /**
     * 标记数据需要同步
     * @param {string} blockId - 内容块ID
     * @param {Object} progressData - 进度数据
     */
    markForSync(blockId, progressData) {
        const syncKey = `sync_pending_${blockId}`;
        const syncData = {
            ...progressData,
            syncTimestamp: Date.now(),
            retryCount: 0
        };
        localStorage.setItem(syncKey, JSON.stringify(syncData));
    }

    /**
     * 同步到服务器
     * @param {string} blockId - 内容块ID
     * @param {Object} progressData - 进度数据
     * @returns {Promise<boolean>} 同步是否成功
     */
    async syncToServer(blockId, progressData) {
        if (this.syncInProgress.has(blockId)) {
            return false;
        }

        this.syncInProgress.add(blockId);

        try {
            const userId = window.AppState?.user?.id;
            if (!userId || !window.ApiService) {
                console.warn('用户未登录或API服务不可用，跳过服务器同步');
                return false;
            }

            await ApiService.saveConversationProgress(userId, progressData);
            
            // 同步成功，清除待同步标记
            const syncKey = `sync_pending_${blockId}`;
            localStorage.removeItem(syncKey);
            
            return true;
        } catch (error) {
            console.error(`同步进度到服务器失败: ${blockId}`, error);
            return false;
        } finally {
            this.syncInProgress.delete(blockId);
        }
    }

    /**
     * 同步所有待同步的进度
     */
    async syncPendingProgress() {
        try {
            const pendingKeys = [];
            
            // 找到所有待同步的数据
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('sync_pending_')) {
                    pendingKeys.push(key);
                }
            }

            if (pendingKeys.length === 0) {
                return;
            }


            for (const key of pendingKeys) {
                try {
                    const syncData = JSON.parse(localStorage.getItem(key));
                    const blockId = key.replace('sync_pending_', '');
                    
                    // 检查重试次数
                    if (syncData.retryCount >= this.maxRetries) {
                        console.warn(`❌ 块 ${blockId} 同步失败次数过多，删除同步标记`);
                        localStorage.removeItem(key);
                        continue;
                    }

                    // 尝试同步
                    const success = await this.syncToServer(blockId, syncData);
                    
                    if (!success) {
                        // 增加重试次数
                        syncData.retryCount = (syncData.retryCount || 0) + 1;
                        localStorage.setItem(key, JSON.stringify(syncData));
                    }
                } catch (error) {
                    console.error(`处理待同步数据失败: ${key}`, error);
                }
            }
        } catch (error) {
            console.error('同步待同步进度时出错:', error);
        }
    }

    /**
     * 删除学习进度
     * @param {string} blockId - 内容块ID
     * @returns {Promise<boolean>} 删除是否成功
     */
    async deleteProgress(blockId) {
        try {
            // 清除缓存
            this.cache.delete(blockId);
            
            // 清除本地存储
            const localKey = `conversation_progress_${blockId}`;
            const syncKey = `sync_pending_${blockId}`;
            localStorage.removeItem(localKey);
            localStorage.removeItem(syncKey);

            // 尝试从服务器删除
            try {
                const userId = window.AppState?.user?.id;
                if (userId && window.ApiService) {
                    await ApiService.deleteConversationProgress(userId, blockId);
                }
            } catch (error) {
                console.warn('删除服务器端进度失败，但本地已清除:', error);
            }

            return true;
        } catch (error) {
            console.error('删除学习进度失败:', error);
            return false;
        }
    }

    /**
     * 获取学习统计信息
     * @returns {Promise<Object>} 统计信息
     */
    async getStats() {
        try {
            const userId = window.AppState?.user?.id;
            if (!userId || !window.ApiService) {
                return this.getLocalStats();
            }

            const response = await ApiService.getConversationStats();
            if (response && response.success) {
                return response.data;
            } else {
                return this.getLocalStats();
            }
        } catch (error) {
            console.error('获取学习统计失败:', error);
            return this.getLocalStats();
        }
    }

    /**
     * 获取本地统计信息（离线模式）
     * @returns {Object} 本地统计信息
     */
    getLocalStats() {
        let totalConversations = 0;
        let completedConversations = 0;
        let totalPoints = 0;

        // 遍历本地存储的进度数据
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('conversation_progress_')) {
                try {
                    const progress = JSON.parse(localStorage.getItem(key));
                    totalConversations++;
                    if (progress.isComplete) {
                        completedConversations++;
                    }
                    totalPoints += progress.pointsEarned || 0;
                } catch (error) {
                    console.warn(`解析本地进度数据失败: ${key}`, error);
                }
            }
        }

        return {
            totalConversations,
            completedConversations,
            totalPoints,
            completionRate: totalConversations > 0 
                ? Math.round((completedConversations / totalConversations) * 100) 
                : 0,
            source: 'local'
        };
    }

    /**
     * 清理过期的缓存和数据
     */
    cleanup() {
        // 清理内存缓存
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > 300000) { // 5分钟过期
                this.cache.delete(key);
            }
        }

        // 清理过期的同步标记（超过24小时）
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith('sync_pending_')) {
                try {
                    const syncData = JSON.parse(localStorage.getItem(key));
                    if (now - syncData.syncTimestamp > 86400000) { // 24小时
                        localStorage.removeItem(key);
                    }
                } catch (error) {
                    // 删除损坏的数据
                    localStorage.removeItem(key);
                }
            }
        }
    }

    /**
     * 销毁管理器
     */
    destroy() {
        this.stopAutoSync();
        this.cleanup();
        this.cache.clear();
        this.syncInProgress.clear();
    }
}

// 创建全局实例
export const learningProgress = new LearningProgressManager();

// 在页面加载时启动自动同步
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        learningProgress.startAutoSync();
    });

    // 在页面关闭前停止自动同步并进行最后的同步
    window.addEventListener('beforeunload', () => {
        learningProgress.stopAutoSync();
        // 尝试最后一次同步（但由于浏览器限制，可能不会完成）
        learningProgress.syncPendingProgress();
    });

    // 定期清理
    setInterval(() => {
        learningProgress.cleanup();
    }, 300000); // 5分钟清理一次
}

export default learningProgress;