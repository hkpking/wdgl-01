/**
 * StorageContext - 云端存储上下文
 * 使用 Supabase 作为后端存储服务
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as supabaseService from '../services/api/documentService';

// Dev/Test 环境下允许绕过鉴权，避免编辑流程被路由守卫阻塞
const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';
const MOCK_USER = {
    id: 'dev-mock-user',
    uid: 'dev-mock-user',
    email: 'dev@example.com',
    displayName: 'Dev Mock User',
};

const StorageContext = createContext(null);

export const StorageProvider = ({ children }) => {
    // 认证状态
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 监听 Supabase 认证状态
    useEffect(() => {
        // 开启绕过模式时，直接注入 Mock 用户并跳过远端鉴权
        if (BYPASS_AUTH) {
            setCurrentUser(MOCK_USER);
            setLoading(false);
            return;
        }

        // 初始化时获取用户
        supabaseService.getCurrentUser().then(user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // 监听认证状态变化
        const { data: { subscription } } = supabaseService.onAuthStateChange((user) => {
            setCurrentUser(user);
        });

        return () => subscription?.unsubscribe();
    }, []);

    // Storage API - 统一使用 Supabase
    const storage = {
        // 导出所有 Supabase 服务方法
        ...supabaseService,

        // 用户管理
        currentUser,
        getCurrentUser: () => currentUser,
        // 绕过模式下强制视为已认证，便于本地/E2E 测试直接进入编辑器
        isAuthenticated: BYPASS_AUTH ? true : !!currentUser,

        // 认证方法
        signIn: async (email, password) => {
            const user = await supabaseService.signInWithEmail(email, password);
            setCurrentUser(user);
            return user;
        },

        signUp: async (email, password, displayName) => {
            return await supabaseService.signUpWithEmail(email, password, displayName);
        },

        signOut: async () => {
            await supabaseService.signOut();
            setCurrentUser(null);
        },

        // 加载状态
        loading,

        // 兼容性属性 (旧代码可能仍在使用)
        isSupabaseMode: true,
        isCloudMode: true,
    };

    return (
        <StorageContext.Provider value={storage}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
};

export { StorageContext };
