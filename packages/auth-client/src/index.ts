/**
 * @wdgl/auth-client
 * 统一认证 SDK 入口
 */

// 导出核心类
export { UnifiedAuthClient } from './client';

// 导出所有类型
export type {
    User,
    UnifiedUser,
    ProductAccessMap,
    ProductAccess,
    AuthState,
    AuthError,
    AuthClientConfig,
    AuthEventType,
    AuthEventCallback,
    EmailCredentials,
    SignUpData,
    UnifiedToken,
} from './types';

// 导出 React 集成
export { AuthProvider, useAuth, useUser, useIsAuthenticated } from './react';
