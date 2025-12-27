/**
 * @file 统一错误处理系统
 * @description 提供全局错误处理、错误分类、错误上报等功能
 * @version 1.0.0
 */

// 错误类型枚举
export const ERROR_TYPES = {
    NETWORK: 'network',
    VALIDATION: 'validation',
    AUTHENTICATION: 'authentication',
    AUTHORIZATION: 'authorization',
    SERVER: 'server',
    CLIENT: 'client',
    UNKNOWN: 'unknown'
};

// 错误级别枚举
export const ERROR_LEVELS = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
};

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.errorCallbacks = new Map();
        this.maxLogSize = 100;
        
        // 初始化全局错误监听
        this.initGlobalErrorHandling();
    }

    /**
     * 初始化全局错误处理
     */
    initGlobalErrorHandling() {
        // 捕获未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, ERROR_TYPES.CLIENT, ERROR_LEVELS.HIGH);
            event.preventDefault();
        });

        // 捕获全局JavaScript错误
        window.addEventListener('error', (event) => {
            this.handleError(
                new Error(`${event.message} at ${event.filename}:${event.lineno}:${event.colno}`),
                ERROR_TYPES.CLIENT,
                ERROR_LEVELS.MEDIUM
            );
        });
    }

    /**
     * 处理错误的主方法
     * @param {Error|string} error - 错误对象或错误消息
     * @param {string} type - 错误类型
     * @param {string} level - 错误级别
     * @param {Object} context - 错误上下文信息
     */
    handleError(error, type = ERROR_TYPES.UNKNOWN, level = ERROR_LEVELS.MEDIUM, context = {}) {
        const errorInfo = this.normalizeError(error, type, level, context);
        
        // 记录错误
        this.logError(errorInfo);
        
        // 触发错误回调
        this.triggerErrorCallbacks(errorInfo);
        
        // 根据级别决定是否上报
        if (level === ERROR_LEVELS.HIGH || level === ERROR_LEVELS.CRITICAL) {
            this.reportError(errorInfo);
        }
        
        // 显示用户友好的错误消息
        this.showUserError(errorInfo);
        
        return errorInfo;
    }

    /**
     * 标准化错误对象
     */
    normalizeError(error, type, level, context) {
        const timestamp = new Date().toISOString();
        const id = this.generateErrorId();
        
        let message, stack;
        
        if (error instanceof Error) {
            message = error.message;
            stack = error.stack;
        } else if (typeof error === 'string') {
            message = error;
            stack = new Error().stack;
        } else {
            message = '未知错误';
            stack = new Error().stack;
        }

        return {
            id,
            timestamp,
            message,
            stack,
            type,
            level,
            context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
    }

    /**
     * 记录错误到本地日志
     */
    logError(errorInfo) {
        this.errorLog.unshift(errorInfo);
        
        // 限制日志大小
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }
        
        // 控制台输出
        const logMethod = this.getConsoleMethod(errorInfo.level);
        console[logMethod](`[${errorInfo.type.toUpperCase()}] ${errorInfo.message}`, errorInfo);
    }

    /**
     * 获取对应的控制台方法
     */
    getConsoleMethod(level) {
        switch (level) {
            case ERROR_LEVELS.LOW:
                return 'info';
            case ERROR_LEVELS.MEDIUM:
                return 'warn';
            case ERROR_LEVELS.HIGH:
            case ERROR_LEVELS.CRITICAL:
                return 'error';
            default:
                return 'log';
        }
    }

    /**
     * 显示用户友好的错误消息
     */
    showUserError(errorInfo) {
        const userMessage = this.getUserFriendlyMessage(errorInfo);
        
        // 如果UI系统可用，使用UI显示错误
        if (window.UI && window.UI.showNotification) {
            const notificationType = errorInfo.level === ERROR_LEVELS.LOW 
                ? 'info' 
                : errorInfo.level === ERROR_LEVELS.MEDIUM 
                ? 'warning' 
                : 'error';
            
            window.UI.showNotification(userMessage, notificationType);
        } else {
            // 降级为alert
            if (errorInfo.level === ERROR_LEVELS.HIGH || errorInfo.level === ERROR_LEVELS.CRITICAL) {
                alert(userMessage);
            }
        }
    }

    /**
     * 获取用户友好的错误消息
     */
    getUserFriendlyMessage(errorInfo) {
        const messageMap = {
            [ERROR_TYPES.NETWORK]: '网络连接出现问题，请检查网络设置后重试',
            [ERROR_TYPES.AUTHENTICATION]: '登录已过期，请重新登录',
            [ERROR_TYPES.AUTHORIZATION]: '您没有权限执行此操作',
            [ERROR_TYPES.VALIDATION]: '输入信息有误，请检查后重试',
            [ERROR_TYPES.SERVER]: '服务器出现临时问题，请稍后重试',
            [ERROR_TYPES.CLIENT]: '页面出现异常，请刷新页面重试'
        };

        return messageMap[errorInfo.type] || '出现了未知错误，请联系技术支持';
    }

    /**
     * 上报错误到服务器
     */
    async reportError(errorInfo) {
        try {
            // 只在生产环境上报错误
            if (process.env.NODE_ENV !== 'production') {
                console.log('开发环境，跳过错误上报');
                return;
            }

            const response = await fetch('/api/errors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(errorInfo)
            });

            if (!response.ok) {
                console.warn('错误上报失败', response.status);
            }
        } catch (reportError) {
            console.warn('错误上报异常', reportError);
        }
    }

    /**
     * 注册错误回调
     */
    onError(type, callback) {
        if (!this.errorCallbacks.has(type)) {
            this.errorCallbacks.set(type, []);
        }
        this.errorCallbacks.get(type).push(callback);
    }

    /**
     * 触发错误回调
     */
    triggerErrorCallbacks(errorInfo) {
        const callbacks = this.errorCallbacks.get(errorInfo.type) || [];
        callbacks.forEach(callback => {
            try {
                callback(errorInfo);
            } catch (callbackError) {
                console.error('错误回调执行失败', callbackError);
            }
        });
    }

    /**
     * 生成错误ID
     */
    generateErrorId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 包装异步函数，自动处理错误
     */
    wrapAsync(fn, type = ERROR_TYPES.CLIENT, level = ERROR_LEVELS.MEDIUM) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.handleError(error, type, level, {
                    function: fn.name,
                    arguments: args
                });
                throw error; // 重新抛出，让调用者可以处理
            }
        };
    }

    /**
     * 包装同步函数，自动处理错误
     */
    wrapSync(fn, type = ERROR_TYPES.CLIENT, level = ERROR_LEVELS.MEDIUM) {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                this.handleError(error, type, level, {
                    function: fn.name,
                    arguments: args
                });
                throw error;
            }
        };
    }

    /**
     * 获取错误统计信息
     */
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            byLevel: {},
            recent: this.errorLog.slice(0, 10)
        };

        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
        });

        return stats;
    }

    /**
     * 清理错误日志
     */
    clearErrorLog() {
        this.errorLog = [];
    }

    /**
     * 导出错误日志
     */
    exportErrorLog() {
        return JSON.stringify(this.errorLog, null, 2);
    }
}

// 创建全局错误处理器实例
export const errorHandler = new ErrorHandler();

// 便捷方法导出
export const handleError = errorHandler.handleError.bind(errorHandler);
export const wrapAsync = errorHandler.wrapAsync.bind(errorHandler);
export const wrapSync = errorHandler.wrapSync.bind(errorHandler);
export const onError = errorHandler.onError.bind(errorHandler);

export default errorHandler;