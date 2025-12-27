/**
 * @file performance-monitor.js
 * @description 性能监控工具，用于测试登录和加载性能（仅控制台日志）
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoad: null,
            authCheck: null,
            login: null,
            dataLoad: null,
            totalTime: null
        };
        this.startTime = Date.now();
        this.init();
    }

    init() {
        // 监听页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.metrics.pageLoad = Date.now() - this.startTime;
                this.logMetric('页面加载', this.metrics.pageLoad);
            });
        } else {
            this.metrics.pageLoad = Date.now() - this.startTime;
            this.logMetric('页面加载', this.metrics.pageLoad);
        }

        // 监听网络状态
        this.monitorNetworkStatus();
    }

    // 开始监控认证检查
    startAuthCheck() {
        this.authCheckStart = Date.now();
    }

    // 完成认证检查
    endAuthCheck() {
        if (this.authCheckStart) {
            this.metrics.authCheck = Date.now() - this.authCheckStart;
            this.logMetric('认证服务检查', this.metrics.authCheck);
        }
    }

    // 开始监控登录
    startLogin() {
        this.loginStart = Date.now();
    }

    // 完成登录
    endLogin() {
        if (this.loginStart) {
            this.metrics.login = Date.now() - this.loginStart;
            this.logMetric('用户登录', this.metrics.login);
        }
    }

    // 开始监控数据加载
    startDataLoad() {
        this.dataLoadStart = Date.now();
    }

    // 完成数据加载
    endDataLoad() {
        if (this.dataLoadStart) {
            this.metrics.dataLoad = Date.now() - this.dataLoadStart;
            this.logMetric('数据加载', this.metrics.dataLoad);
            
            // 计算总时间（从登录开始到数据加载完成）
            if (this.loginStart) {
                this.metrics.totalTime = Date.now() - this.loginStart;
                this.logMetric('总耗时', this.metrics.totalTime);
            }
        }
    }

    // 记录性能指标
    logMetric(name, duration) {
        const status = this.getPerformanceStatus(duration, name);
    }

    // 获取性能状态
    getPerformanceStatus(duration, type) {
        const thresholds = {
            '页面加载': { good: 1000, warning: 3000 },
            '认证服务检查': { good: 2000, warning: 4000 },
            '用户登录': { good: 5000, warning: 15000 }, // 根据实际情况调整登录阈值
            '数据加载': { good: 2000, warning: 5000 },
            '总耗时': { good: 8000, warning: 20000 } // 根据实际情况调整总耗时阈值
        };

        const threshold = thresholds[type] || { good: 2000, warning: 5000 };
        
        if (duration <= threshold.good) {
            return { icon: '✅', message: '优秀', color: 'green' };
        } else if (duration <= threshold.warning) {
            return { icon: '⚠️', message: '良好', color: 'yellow' };
        } else {
            return { icon: '❌', message: '需要优化', color: 'red' };
        }
    }

    // 监控网络状态
    monitorNetworkStatus() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
        }
    }
}

// 创建全局实例
window.PerformanceMonitor = PerformanceMonitor;
