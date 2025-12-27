"use client";

/**
 * SWR 全局配置 Provider
 */

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
    children: ReactNode;
}

/**
 * SWR 全局配置
 */
const swrOptions = {
    // 窗口聚焦时不自动刷新（避免频繁请求）
    revalidateOnFocus: false,
    // 网络恢复时刷新
    revalidateOnReconnect: true,
    // 相同请求去重间隔
    dedupingInterval: 5000,
    // 错误重试
    errorRetryCount: 3,
    errorRetryInterval: 3000,
    // 加载超时
    loadingTimeout: 5000,
    // 错误处理
    onError: (error: Error, key: string) => {
        console.error(`[SWR Error] ${key}:`, error.message);
    },
};

export default function SWRProvider({ children }: SWRProviderProps) {
    return (
        <SWRConfig value={swrOptions}>
            {children}
        </SWRConfig>
    );
}
