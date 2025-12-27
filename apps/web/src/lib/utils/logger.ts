/**
 * 日志工具函数
 * 根据环境变量控制日志输出级别
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Logger 类型定义
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
    /** 调试日志，仅在开发环境输出 */
    debug: (...args: unknown[]) => void;
    /** 信息日志，仅在开发环境输出 */
    info: (...args: unknown[]) => void;
    /** 警告日志，始终输出 */
    warn: (...args: unknown[]) => void;
    /** 错误日志，始终输出 */
    error: (...args: unknown[]) => void;
}

/**
 * 创建带前缀的 logger
 * @param prefix 日志前缀，如 '[Search]' '[Embedding]'
 */
export function createLogger(prefix: string): Logger {
    return {
        debug: (...args: unknown[]) => {
            if (isDev) console.log(prefix, ...args);
        },
        info: (...args: unknown[]) => {
            if (isDev) console.log(prefix, ...args);
        },
        warn: (...args: unknown[]) => {
            console.warn(prefix, ...args);
        },
        error: (...args: unknown[]) => {
            console.error(prefix, ...args);
        },
    };
}

/**
 * 默认 logger 实例
 */
export const logger: Logger = {
    debug: (...args: unknown[]) => {
        if (isDev) console.log(...args);
    },
    info: (...args: unknown[]) => {
        if (isDev) console.log(...args);
    },
    warn: (...args: unknown[]) => {
        console.warn(...args);
    },
    error: (...args: unknown[]) => {
        console.error(...args);
    },
};

export default logger;
