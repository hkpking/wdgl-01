"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// 对话消息接口
export interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp?: number;
    references?: SearchReference[];
}

// 搜索引用接口
export interface SearchReference {
    id: string;
    document_id: string;
    title: string;
    chunk_text: string;
    similarity?: number;
    metadata?: {
        title?: string;
        docId?: string;
    };
}

// 对话接口
export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY = 'ai_conversations';
const MAX_CONVERSATIONS = 50;

/**
 * 本地对话历史 Hook
 */
export function useConversationHistory(userId?: string) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 使用 ref 跟踪最新的 currentConversationId，避免闭包问题
    const currentConversationIdRef = useRef<string | null>(null);

    // 同步 ref 与 state
    useEffect(() => {
        currentConversationIdRef.current = currentConversationId;
    }, [currentConversationId]);

    // 获取存储 key（按用户隔离）
    const getStorageKey = useCallback(() => {
        return userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY;
    }, [userId]);

    // 加载对话历史
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(getStorageKey());
            if (stored) {
                const parsed = JSON.parse(stored) as Conversation[];
                setConversations(parsed);
                // 自动选择最近的对话
                if (parsed.length > 0) {
                    setCurrentConversationId(parsed[0].id);
                }
            }
        } catch (error) {
            console.error('加载对话历史失败:', error);
        } finally {
            setIsLoading(false);
        }
    }, [getStorageKey]);

    // 保存到 localStorage
    const saveToStorage = useCallback((convs: Conversation[]) => {
        if (typeof window === 'undefined') return;
        try {
            // 限制最大数量
            const trimmed = convs.slice(0, MAX_CONVERSATIONS);
            localStorage.setItem(getStorageKey(), JSON.stringify(trimmed));
        } catch (error) {
            console.error('保存对话历史失败:', error);
        }
    }, [getStorageKey]);

    // 创建新对话
    const createConversation = useCallback((title?: string): string => {
        const newConv: Conversation = {
            id: `conv_${Date.now()}`,
            title: title || '新对话',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setConversations(prev => {
            const updated = [newConv, ...prev];
            saveToStorage(updated);
            return updated;
        });

        setCurrentConversationId(newConv.id);
        return newConv.id;
    }, [saveToStorage]);

    // 获取当前对话
    const currentConversation = conversations.find(c => c.id === currentConversationId) || null;

    // 添加消息到当前对话
    // 使用 ref 来获取最新的 conversationId，避免 stale closure
    const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
        const newMessage: Message = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now()
        };

        // 使用 ref 获取最新的 conversationId
        const convId = currentConversationIdRef.current;

        // 如果没有当前对话，同步创建并添加消息
        if (!convId) {
            const newConvId = `conv_${Date.now()}`;
            const newConv: Conversation = {
                id: newConvId,
                title: message.role === 'user' ? message.content.substring(0, 30) : '新对话',
                messages: [newMessage],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // 立即更新 ref，让后续的 addMessage 调用能看到新的 ID
            currentConversationIdRef.current = newConvId;

            setConversations(prev => {
                const updated = [newConv, ...prev];
                saveToStorage(updated);
                return updated;
            });
            setCurrentConversationId(newConvId);
            return newMessage;
        }

        // 已有对话，正常添加消息
        setConversations(prev => {
            const updated = prev.map(conv => {
                if (conv.id === convId) {
                    // 如果是第一条用户消息，更新对话标题
                    const shouldUpdateTitle = conv.messages.length === 0 && message.role === 'user';
                    return {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        title: shouldUpdateTitle ? message.content.substring(0, 30) : conv.title,
                        updatedAt: Date.now()
                    };
                }
                return conv;
            });

            // 把当前对话移到最前面
            const currentIndex = updated.findIndex(c => c.id === convId);
            if (currentIndex > 0) {
                const [current] = updated.splice(currentIndex, 1);
                updated.unshift(current);
            }

            saveToStorage(updated);
            return updated;
        });

        return newMessage;
    }, [saveToStorage]);

    // 更新消息（用于流式更新 AI 回复）
    // 注意：不再依赖 currentConversationId，而是根据 messageId 在所有对话中查找
    // 这样可以避免首次发送消息时的 stale closure 问题
    const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
        setConversations(prev => {
            const updated = prev.map(conv => {
                // 检查这个对话是否包含要更新的消息
                const hasMessage = conv.messages.some(msg => msg.id === messageId);
                if (hasMessage) {
                    return {
                        ...conv,
                        messages: conv.messages.map(msg =>
                            msg.id === messageId ? { ...msg, ...updates } : msg
                        ),
                        updatedAt: Date.now()
                    };
                }
                return conv;
            });
            saveToStorage(updated);
            return updated;
        });
    }, [saveToStorage]);

    // 切换对话
    const switchConversation = useCallback((conversationId: string) => {
        setCurrentConversationId(conversationId);
    }, []);

    // 删除对话
    const deleteConversation = useCallback((conversationId: string) => {
        setConversations(prev => {
            const updated = prev.filter(c => c.id !== conversationId);
            saveToStorage(updated);

            // 如果删除的是当前对话，切换到下一个
            if (conversationId === currentConversationId) {
                setCurrentConversationId(updated[0]?.id || null);
            }

            return updated;
        });
    }, [currentConversationId, saveToStorage]);

    // 清空所有对话
    const clearAllConversations = useCallback(() => {
        setConversations([]);
        setCurrentConversationId(null);
        localStorage.removeItem(getStorageKey());
    }, [getStorageKey]);

    // 开始新对话（不保存空对话）
    const startNewConversation = useCallback(() => {
        // 如果当前对话为空，复用它
        if (currentConversation && currentConversation.messages.length === 0) {
            return currentConversation.id;
        }
        return createConversation();
    }, [currentConversation, createConversation]);

    return {
        // 状态
        conversations,
        currentConversation,
        currentConversationId,
        isLoading,

        // 操作
        createConversation,
        startNewConversation,
        addMessage,
        updateMessage,
        switchConversation,
        deleteConversation,
        clearAllConversations
    };
}
