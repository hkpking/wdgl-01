'use client';

/**
 * StorageContext - 云端存储上下文
 * 使用 Supabase 作为后端存储服务
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as supabaseService from '@/lib/services/api/documentService';
import type { User, StorageContextType } from '@/types/storage';

// Dev/Test 环境下允许绕过鉴权，避免编辑流程被路由守卫阻塞
const BYPASS_AUTH = process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true';
const MOCK_USER: User = {
    uid: 'dev-mock-user',
    email: 'dev@example.com',
    displayName: 'Dev Mock User',
};

const StorageContext = createContext<StorageContextType | null>(null);

interface StorageProviderProps {
    children: ReactNode;
}

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
    // 认证状态
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // 监听 Supabase 认证状态
    useEffect(() => {
        // 开启绕过模式时，直接注入 Mock 用户并跳过远端鉴权
        if (BYPASS_AUTH) {
            setCurrentUser(MOCK_USER);
            setLoading(false);
            return;
        }

        // 超时保护：如果 5 秒内无法完成初始化，强制结束 loading 状态
        let timeoutId = setTimeout(() => {
            console.warn('[Auth] 初始化超时，强制结束 loading 状态');
            setLoading(false);
        }, 5000);

        // 初始化时获取用户
        supabaseService.getCurrentUser()
            .then((user: User | null) => {
                clearTimeout(timeoutId);
                console.log('[Auth] 获取用户:', user?.email || '未登录');
                setCurrentUser(user);
            })
            .catch((error: Error) => {
                clearTimeout(timeoutId);
                console.error('[Auth] 获取用户失败:', error);
                setCurrentUser(null);
            })
            .finally(() => {
                clearTimeout(timeoutId);
                setLoading(false);
            });

        // 监听认证状态变化
        const { data: { subscription } } = supabaseService.onAuthStateChange((user: User | null) => {
            console.log('[Auth] 状态变化:', user?.email || '已登出');
            setCurrentUser(user);
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Storage API - 统一使用 Supabase
    // 显式声明每个方法以确保类型安全
    const storage: StorageContextType = {
        // 用户管理
        currentUser,
        loading,
        isAuthenticated: BYPASS_AUTH ? true : !!currentUser,
        getCurrentUser: () => currentUser,

        // 认证方法
        signIn: async (email: string, password: string) => {
            const user = await supabaseService.signInWithEmail(email, password);
            setCurrentUser(user);
            return user;
        },
        signUp: async (email: string, password: string, displayName: string) => {
            return await supabaseService.signUpWithEmail(email, password, displayName);
        },
        signOut: async () => {
            await supabaseService.signOut();
            setCurrentUser(null);
        },

        // 文档方法
        getAllDocuments: supabaseService.getAllDocuments,
        getDocument: supabaseService.getDocument,
        saveDocument: supabaseService.saveDocument,
        deleteDocument: supabaseService.deleteDocument,
        moveDocument: supabaseService.moveDocument,
        searchDocuments: supabaseService.searchDocuments,

        // 版本方法
        getVersions: supabaseService.getVersions,
        saveVersion: supabaseService.saveVersion,
        updateVersion: supabaseService.updateVersion,

        // 文件夹方法
        getFolders: supabaseService.getFolders,
        createFolder: supabaseService.createFolder,
        updateFolder: supabaseService.updateFolder,
        deleteFolder: supabaseService.deleteFolder,

        // 评论方法
        getComments: supabaseService.getComments,
        addComment: supabaseService.addComment,
        addReply: supabaseService.addReply,
        updateCommentStatus: supabaseService.updateCommentStatus,
        deleteComment: supabaseService.deleteComment,

        // 存储信息
        getStorageInfo: supabaseService.getStorageInfo,

        // 兼容性属性
        isSupabaseMode: true,
        isCloudMode: true,
    };

    return (
        <StorageContext.Provider value={storage}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = (): StorageContextType => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};

export { StorageContext };
export type { StorageContextType };
