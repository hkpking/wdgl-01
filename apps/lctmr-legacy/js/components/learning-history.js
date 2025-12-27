/**
 * @file learning-history.js
 * @description 学习历史记录组件 - 显示用户完成的学习内容和积分记录
 * @version 1.0.0
 */

export class LearningHistory {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            itemsPerPage: 10,
            showStats: true,
            ...options
        };
        
        this.historyData = [];
        this.currentPage = 1;
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadHistoryData();
            this.render();
            this.bindEvents();
        } catch (error) {
            console.error('初始化学习历史失败:', error);
            this.renderError('加载学习历史失败，请稍后重试');
        }
    }
    
    async loadHistoryData() {
        try {
            // 从本地存储获取历史记录
            const localHistory = this.getLocalHistory();
            
            // 尝试从服务器获取更完整的历史记录
            let serverHistory = [];
            if (window.ApiService && window.AppState?.user?.id) {
                try {
                    serverHistory = await this.getServerHistory();
                } catch (error) {
                    console.warn('获取服务器历史记录失败，使用本地记录:', error);
                }
            }
            
            // 合并并去重历史记录
            this.historyData = this.mergeHistory(localHistory, serverHistory);
            
            // 按完成时间排序（最新的在前）
            this.historyData.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
            
        } catch (error) {
            console.error('加载历史数据失败:', error);
            throw error;
        }
    }
    
    getLocalHistory() {
        const history = [];
        
        // 遍历localStorage中的对话学习进度
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('conversation_progress_')) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data && data.isComplete) {
                        history.push({
                            blockId: data.blockId,
                            completedAt: data.lastSaveTime,
                            completedSteps: data.currentStep,
                            completedTests: data.completedTests?.length || 0,
                            source: 'local'
                        });
                    }
                } catch (error) {
                    console.warn('解析本地历史记录失败:', key, error);
                }
            }
        }
        
        return history;
    }
    
    async getServerHistory() {
        // 这里可以调用API获取服务器端的历史记录
        // 暂时返回空数组，等后端API ready
        return [];
    }
    
    mergeHistory(localHistory, serverHistory) {
        const merged = [...localHistory];
        const localBlockIds = new Set(localHistory.map(item => item.blockId));
        
        // 添加服务器端独有的记录
        for (const serverItem of serverHistory) {
            if (!localBlockIds.has(serverItem.blockId)) {
                merged.push({ ...serverItem, source: 'server' });
            }
        }
        
        return merged;
    }
    
    render() {
        const stats = this.calculateStats();
        
        this.container.innerHTML = `
            <div class="learning-history">
                ${this.options.showStats ? this.renderStats(stats) : ''}
                ${this.renderHistoryList()}
                ${this.renderPagination()}
            </div>
        `;
        
        this.addStyles();
    }
    
    renderStats(stats) {
        return `
            <div class="history-stats">
                <div class="stats-header">
                    <h3>📊 学习统计</h3>
                </div>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalCompleted}</div>
                        <div class="stat-label">已完成课程</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${stats.totalTests}</div>
                        <div class="stat-label">完成测试</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderHistoryList() {
        if (this.historyData.length === 0) {
            return `
                <div class="history-empty">
                    <div class="empty-icon">📝</div>
                    <div class="empty-title">还没有学习记录</div>
                    <div class="empty-desc">完成一些课程后，这里会显示您的学习历史</div>
                </div>
            `;
        }
        
        const startIndex = (this.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const pageItems = this.historyData.slice(startIndex, endIndex);
        
        return `
            <div class="history-list">
                <div class="list-header">
                    <h3>📚 学习记录</h3>
                    <div class="list-actions">
                        <button class="btn-clear" onclick="learningHistory.clearHistory()">
                            🗑️ 清空记录
                        </button>
                    </div>
                </div>
                <div class="history-items">
                    ${pageItems.map(item => this.renderHistoryItem(item)).join('')}
                </div>
            </div>
        `;
    }
    
    renderHistoryItem(item) {
        const completedDate = new Date(item.completedAt);
        const timeAgo = this.getTimeAgo(completedDate);
        
        return `
            <div class="history-item" data-block-id="${item.blockId}">
                <div class="item-header">
                    <div class="item-title">
                        <span class="title-text">学习内容 #${item.blockId.slice(-6)}</span>
                        <span class="source-badge ${item.source}">${item.source === 'local' ? '本地' : '云端'}</span>
                    </div>
                    <div class="item-date" title="${completedDate.toLocaleString()}">${timeAgo}</div>
                </div>
                <div class="item-stats">
                    <div class="stat">
                        <span class="stat-icon">🎯</span>
                        <span class="stat-text">${item.completedSteps || 0}步完成</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">📝</span>
                        <span class="stat-text">${item.completedTests || 0}个测试</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-view" onclick="learningHistory.viewDetails('${item.blockId}')">
                        👁️ 查看详情
                    </button>
                    <button class="btn-retry" onclick="learningHistory.retryLearning('${item.blockId}')">
                        🔄 重新学习
                    </button>
                </div>
            </div>
        `;
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.historyData.length / this.options.itemsPerPage);
        
        if (totalPages <= 1) return '';
        
        return `
            <div class="history-pagination">
                <button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="learningHistory.goToPage(${this.currentPage - 1})">
                    ← 上一页
                </button>
                <span class="page-info">第 ${this.currentPage} 页，共 ${totalPages} 页</span>
                <button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} 
                        onclick="learningHistory.goToPage(${this.currentPage + 1})">
                    下一页 →
                </button>
            </div>
        `;
    }
    
    calculateStats() {
        const totalCompleted = this.historyData.length;
        const totalTests = this.historyData.reduce((sum, item) => sum + (item.completedTests || 0), 0);
        
        return {
            totalCompleted,
            totalTests
        };
    }
    
    bindEvents() {
        // 全局暴露实例，方便按钮调用
        window.learningHistory = this;
    }
    
    goToPage(page) {
        const totalPages = Math.ceil(this.historyData.length / this.options.itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.render();
    }
    
    async clearHistory() {
        if (!confirm('确定要清空所有学习记录吗？此操作无法撤销。')) {
            return;
        }
        
        try {
            // 清理本地存储中的学习记录
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('conversation_progress_')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // 重新加载数据
            await this.loadHistoryData();
            this.render();
            
            
        } catch (error) {
            console.error('清空历史记录失败:', error);
            alert('清空失败，请稍后重试');
        }
    }
    
    viewDetails(blockId) {
        // 显示详细信息弹窗
        const item = this.historyData.find(h => h.blockId === blockId);
        if (!item) return;
        
        alert(`学习详情\n\n内容ID: ${blockId}\n完成时间: ${new Date(item.completedAt).toLocaleString()}\n完成步骤: ${item.completedSteps}\n完成测试: ${item.completedTests}`);
    }
    
    retryLearning(blockId) {
        if (confirm('确定要重新学习这个内容吗？之前的进度将被重置。')) {
            // 清除该内容的本地进度
            localStorage.removeItem(`conversation_progress_${blockId}`);
            localStorage.removeItem(`points_synced_${blockId}`);
            
            alert('学习进度已重置，您可以重新开始学习这个内容了。');
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    }
    
    addStyles() {
        if (document.getElementById('learning-history-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'learning-history-styles';
        styles.textContent = `
            .learning-history {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .history-stats {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
                color: white;
            }
            
            .stats-header h3 {
                margin: 0 0 20px 0;
                font-size: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
            }
            
            .stat-item {
                text-align: center;
                padding: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                backdrop-filter: blur(10px);
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 4px;
            }
            
            .stat-label {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .history-empty {
                text-align: center;
                padding: 60px 20px;
                color: #6b7280;
            }
            
            .empty-icon {
                font-size: 64px;
                margin-bottom: 16px;
            }
            
            .empty-title {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #374151;
            }
            
            .empty-desc {
                font-size: 16px;
            }
            
            .list-header {
                display: flex;
                justify-content: between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 2px solid #e5e7eb;
            }
            
            .list-header h3 {
                margin: 0;
                font-size: 18px;
                color: #374151;
            }
            
            .btn-clear {
                background: #ef4444;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .btn-clear:hover {
                background: #dc2626;
            }
            
            .history-item {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .history-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .item-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .title-text {
                font-weight: 600;
                color: #374151;
            }
            
            .source-badge {
                font-size: 12px;
                padding: 2px 8px;
                border-radius: 12px;
                font-weight: 500;
            }
            
            .source-badge.local {
                background: #dbeafe;
                color: #1d4ed8;
            }
            
            .source-badge.server {
                background: #d1fae5;
                color: #059669;
            }
            
            .item-date {
                font-size: 14px;
                color: #6b7280;
            }
            
            .item-stats {
                display: flex;
                gap: 24px;
                margin-bottom: 16px;
            }
            
            .stat {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                color: #6b7280;
            }
            
            .stat.points {
                color: #059669;
                font-weight: 600;
            }
            
            .item-actions {
                display: flex;
                gap: 8px;
            }
            
            .btn-view, .btn-retry {
                padding: 6px 12px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .btn-view:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }
            
            .btn-retry:hover {
                background: #fef3c7;
                border-color: #f59e0b;
            }
            
            .history-pagination {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 16px;
                margin-top: 32px;
            }
            
            .page-btn {
                padding: 8px 16px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .page-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .page-btn:not(:disabled):hover {
                background: #f3f4f6;
                border-color: #9ca3af;
            }
            
            .page-info {
                color: #6b7280;
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .learning-history {
                    padding: 16px;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .item-stats {
                    flex-direction: column;
                    gap: 8px;
                }
                
                .item-actions {
                    flex-direction: column;
                }
                
                .list-header {
                    flex-direction: column;
                    gap: 12px;
                    align-items: flex-start;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

export default LearningHistory;