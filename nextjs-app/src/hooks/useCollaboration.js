/**
 * 协作服务 Hook
 * 管理 Yjs 文档和 WebSocket 连接
 * 支持自动重连、错误状态、手动重连
 */
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import collaborationConfig from '../config/collaboration';

// 重连配置
const RECONNECT_CONFIG = {
    maxAttempts: 5,
    baseDelay: 1000,  // 1秒
    maxDelay: 30000,  // 最大30秒
};

/**
 * 使用协作功能的 Hook
 * @param {string} documentId - 文档 ID，用作协作房间名
 * @param {object} user - 当前用户信息 { id, name, color }
 * @returns {object} { ydoc, provider, isConnected, isSynced, connectedUsers, connectionError, reconnect }
 */
export function useCollaboration(documentId, user) {
    const [isConnected, setIsConnected] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [connectionError, setConnectionError] = useState(null);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const reconnectTimeoutRef = useRef(null);
    const providerRef = useRef(null);

    // 创建 Yjs 文档
    const ydoc = useMemo(() => {
        if (!documentId || !collaborationConfig.enabled) return null;
        return new Y.Doc();
    }, [documentId]);

    // 计算重连延迟（指数退避）
    const getReconnectDelay = useCallback((attempt) => {
        const delay = Math.min(
            RECONNECT_CONFIG.baseDelay * Math.pow(2, attempt),
            RECONNECT_CONFIG.maxDelay
        );
        return delay;
    }, []);

    // 手动重连方法
    const reconnect = useCallback(() => {
        if (providerRef.current) {
            setConnectionError(null);
            setReconnectAttempts(0);
            providerRef.current.connect();
        }
    }, []);

    // WebSocket 提供者
    const provider = useMemo(() => {
        if (!ydoc || !documentId) return null;

        const wsProvider = new WebsocketProvider(
            collaborationConfig.wsUrl,
            documentId,
            ydoc,
            {
                connect: true,
                // 禁用内置重连，使用自定义逻辑
                resyncInterval: 3000,
            }
        );

        providerRef.current = wsProvider;
        return wsProvider;
    }, [ydoc, documentId]);

    // 本地持久化 (离线支持)
    useEffect(() => {
        if (!ydoc || !documentId) return;

        const indexeddbProvider = new IndexeddbPersistence(documentId, ydoc);

        indexeddbProvider.on('synced', () => {
            console.log('[Collaboration] 本地缓存已同步');
        });

        return () => {
            indexeddbProvider.destroy();
        };
    }, [ydoc, documentId]);

    // 连接状态管理（增强版）
    useEffect(() => {
        if (!provider) return;

        const handleStatus = ({ status }) => {
            const connected = status === 'connected';
            setIsConnected(connected);

            if (connected) {
                // 连接成功，清除错误状态
                setConnectionError(null);
                setReconnectAttempts(0);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            } else if (status === 'disconnected') {
                // 断开连接，尝试重连
                setReconnectAttempts(prev => {
                    const newAttempts = prev + 1;

                    if (newAttempts <= RECONNECT_CONFIG.maxAttempts) {
                        const delay = getReconnectDelay(newAttempts);
                        console.log(`[Collaboration] 第 ${newAttempts} 次重连，${delay / 1000}秒后尝试...`);

                        reconnectTimeoutRef.current = setTimeout(() => {
                            if (provider && !provider.wsconnected) {
                                provider.connect();
                            }
                        }, delay);
                    } else {
                        // 超过最大重试次数
                        setConnectionError('连接失败，请检查网络后手动重连');
                    }

                    return newAttempts;
                });
            }
        };

        const handleSync = (synced) => {
            setIsSynced(synced);
        };

        const handleConnectionError = (error) => {
            console.error('[Collaboration] 连接错误:', error);
            setConnectionError('WebSocket 连接异常');
        };

        provider.on('status', handleStatus);
        provider.on('sync', handleSync);
        provider.on('connection-error', handleConnectionError);

        // 设置用户信息 (用于光标显示)
        if (user && provider.awareness) {
            provider.awareness.setLocalStateField('user', {
                id: user.id || user.uid,
                name: user.name || user.displayName || user.email || '匿名用户',
                color: user.color || collaborationConfig.getRandomColor()
            });

            // 监听其他用户
            const handleAwarenessChange = () => {
                const states = Array.from(provider.awareness.getStates().values());
                const users = states
                    .filter(state => state.user)
                    .map(state => state.user);
                setConnectedUsers(users);
            };

            provider.awareness.on('change', handleAwarenessChange);
            handleAwarenessChange(); // 初始化

            return () => {
                provider.awareness.off('change', handleAwarenessChange);
            };
        }

        return () => {
            provider.off('status', handleStatus);
            provider.off('sync', handleSync);
            provider.off('connection-error', handleConnectionError);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [provider, user, getReconnectDelay]);

    // 清理
    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (provider) {
                provider.disconnect();
                provider.destroy();
            }
            if (ydoc) {
                ydoc.destroy();
            }
        };
    }, [provider, ydoc]);

    return {
        ydoc,
        provider,
        isConnected,
        isSynced,
        connectedUsers,
        connectionError,
        reconnectAttempts,
        reconnect,
    };
}

export default useCollaboration;
