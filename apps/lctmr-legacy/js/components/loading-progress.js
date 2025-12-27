/**
 * @file loading-progress.js
 * @description 加载进度条组件，提供美观的加载反馈
 */

export class LoadingProgress {
    constructor() {
        this.container = null;
        this.progressBar = null;
        this.statusText = null;
        this.currentProgress = 0;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createProgressContainer();
        this.hide();
    }

    createProgressContainer() {
        // 创建底部进度条容器
        this.container = document.createElement('div');
        this.container.id = 'loading-progress-container';
        this.container.className = 'fixed bottom-0 left-0 right-0 z-50 p-4';
        this.container.style.display = 'none';

        // 创建底部进度条内容
        const progressContent = document.createElement('div');
        progressContent.className = 'bg-slate-900/90 backdrop-blur-lg rounded-lg p-3 mx-auto max-w-md border border-slate-700/50 shadow-2xl';

        // 状态文本和进度条在同一行
        const topRow = document.createElement('div');
        topRow.className = 'flex items-center justify-between mb-2';

        // 状态文本
        this.statusText = document.createElement('span');
        this.statusText.className = 'text-gray-300 text-sm';
        this.statusText.textContent = '正在加载...';
        topRow.appendChild(this.statusText);

        // 进度百分比
        this.progressText = document.createElement('span');
        this.progressText.className = 'text-gray-400 text-xs';
        this.progressText.textContent = '0%';
        topRow.appendChild(this.progressText);

        progressContent.appendChild(topRow);

        // 进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden';

        // 进度条
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 ease-out';
        this.progressBar.style.width = '0%';
        progressContainer.appendChild(this.progressBar);

        progressContent.appendChild(progressContainer);

        this.container.appendChild(progressContent);
        document.body.appendChild(this.container);
    }

    show() {
        if (this.container) {
            this.container.style.display = 'flex';
            this.isVisible = true;
            // 添加淡入动画
            requestAnimationFrame(() => {
                this.container.style.opacity = '0';
                this.container.style.transition = 'opacity 0.3s ease-in-out';
                requestAnimationFrame(() => {
                    this.container.style.opacity = '1';
                });
            });
        }
    }

    hide() {
        if (this.container) {
            this.container.style.transition = 'opacity 0.3s ease-in-out';
            this.container.style.opacity = '0';
            setTimeout(() => {
                this.container.style.display = 'none';
                this.isVisible = false;
            }, 300);
        }
    }

    updateProgress(progress, statusText = null) {
        this.currentProgress = Math.min(100, Math.max(0, progress));
        
        if (this.progressBar) {
            this.progressBar.style.width = `${this.currentProgress}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${Math.round(this.currentProgress)}%`;
        }
        
        if (statusText && this.statusText) {
            this.statusText.textContent = statusText;
        }
    }

    setStatus(statusText) {
        if (this.statusText) {
            this.statusText.textContent = statusText;
        }
    }

    // 预定义的加载阶段
    setLoadingStage(stage) {
        const stages = {
            'init': { progress: 10, text: '初始化中...' },
            'deps': { progress: 20, text: '加载依赖...' },
            'auth': { progress: 30, text: '验证身份...' },
            'profile': { progress: 50, text: '加载用户信息...' },
            'data': { progress: 70, text: '获取数据...' },
            'leaderboard': { progress: 85, text: '加载排行榜...' },
            'challenges': { progress: 95, text: '获取挑战...' },
            'complete': { progress: 100, text: '完成！' }
        };

        const stageInfo = stages[stage];
        if (stageInfo) {
            this.updateProgress(stageInfo.progress, stageInfo.text);
        }
    }

}

// 创建全局实例
window.LoadingProgress = LoadingProgress;
