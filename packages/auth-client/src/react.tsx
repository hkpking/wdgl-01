/**
 * React 集成
 * 提供 AuthProvider 和 useAuth Hook
 */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UnifiedAuthClient } from './client';
import type { UnifiedUser, AuthState, AuthClientConfig, EmailCredentials, SignUpData } from './types';

// ============================================
// Context 定义
// ============================================

interface AuthContextValue extends AuthState {
    signIn: (credentials: EmailCredentials) => Promise<UnifiedUser>;
    signUp: (data: SignUpData) => Promise<UnifiedUser>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    hasProductAccess: (productId: string) => Promise<boolean>;
    navigateToProduct: (productId: string, path?: string) => Promise<string>;
    client: UnifiedAuthClient;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ============================================
// Provider 组件
// ============================================

interface AuthProviderProps {
    children: ReactNode;
    config: AuthClientConfig;
    /**
     * 开发环境跳过认证
     */
    bypassAuth?: boolean;
    /**
     * Mock 用户（bypassAuth 时使用）
     */
    mockUser?: UnifiedUser;
}

/**
 * 统一认证 Provider
 * 包裹应用根组件，提供认证上下文
 */
export function AuthProvider({
    children,
    config,
    bypassAuth = false,
    mockUser,
}: AuthProviderProps) {
    const [client] = useState(() => new UnifiedAuthClient(config));
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        loading: true,
        isAuthenticated: false,
        error: null,
    });

    // 初始化认证状态
    useEffect(() => {
        // 开发环境跳过认证
        if (bypassAuth) {
            const devUser = mockUser || {
                uid: 'dev-mock-user',
                email: 'dev@example.com',
                displayName: 'Dev Mock User',
            };
            setAuthState({
                user: devUser,
                loading: false,
                isAuthenticated: true,
                error: null,
            });
            return;
        }

        // 超时保护
        const timeoutId = setTimeout(() => {
            console.warn('[AuthProvider] 初始化超时');
            setAuthState(prev => ({ ...prev, loading: false }));
        }, 5000);

        // 获取当前用户
        client.getUser()
            .then(user => {
                clearTimeout(timeoutId);
                setAuthState({
                    user,
                    loading: false,
                    isAuthenticated: !!user,
                    error: null,
                });
            })
            .catch(error => {
                clearTimeout(timeoutId);
                console.error('[AuthProvider] 初始化失败:', error);
                setAuthState({
                    user: null,
                    loading: false,
                    isAuthenticated: false,
                    error: error,
                });
            });

        // 监听认证状态变化
        const unsubscribe = client.onAuthStateChange((event, user) => {
            console.log('[AuthProvider] 状态变化:', event, user?.email);
            setAuthState(prev => ({
                ...prev,
                user,
                isAuthenticated: !!user,
            }));
        });

        return () => {
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, [client, bypassAuth, mockUser]);

    // 登录
    const signIn = useCallback(async (credentials: EmailCredentials) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = await client.signIn(credentials);
            setAuthState({
                user,
                loading: false,
                isAuthenticated: true,
                error: null,
            });
            return user;
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error,
            }));
            throw error;
        }
    }, [client]);

    // 注册
    const signUp = useCallback(async (data: SignUpData) => {
        setAuthState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const user = await client.signUp(data);
            setAuthState(prev => ({ ...prev, loading: false }));
            return user;
        } catch (error: any) {
            setAuthState(prev => ({
                ...prev,
                loading: false,
                error,
            }));
            throw error;
        }
    }, [client]);

    // 登出
    const signOut = useCallback(async () => {
        await client.signOut();
        setAuthState({
            user: null,
            loading: false,
            isAuthenticated: false,
            error: null,
        });
    }, [client]);

    // 刷新用户
    const refreshUser = useCallback(async () => {
        const user = await client.getUser();
        setAuthState(prev => ({
            ...prev,
            user,
            isAuthenticated: !!user,
        }));
    }, [client]);

    // 检查产品权限
    const hasProductAccess = useCallback(async (productId: string) => {
        return client.hasProductAccess(productId);
    }, [client]);

    // 导航到其他产品
    const navigateToProduct = useCallback(async (productId: string, path?: string) => {
        return client.navigateToProduct(productId, path);
    }, [client]);

    const contextValue: AuthContextValue = {
        ...authState,
        signIn,
        signUp,
        signOut,
        refreshUser,
        hasProductAccess,
        navigateToProduct,
        client,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// ============================================
// Hook
// ============================================

/**
 * 使用认证上下文
 */
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * 获取当前用户（快捷方式）
 */
export function useUser(): UnifiedUser | null {
    const { user } = useAuth();
    return user;
}

/**
 * 检查认证状态（快捷方式）
 */
export function useIsAuthenticated(): boolean {
    const { isAuthenticated, loading } = useAuth();
    return !loading && isAuthenticated;
}
