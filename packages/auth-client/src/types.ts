/**
 * 统一认证 SDK - 类型定义
 * @wdgl/auth-client
 */

// ============================================
// 用户类型
// ============================================

/**
 * 基础用户信息
 */
export interface User {
    uid: string;
    email?: string;
    displayName: string;
}

/**
 * 扩展用户信息（含产品权限）
 */
export interface UnifiedUser extends User {
    orgId?: string;
    productAccess?: ProductAccessMap;
}

/**
 * 产品访问权限映射
 */
export interface ProductAccessMap {
    [productId: string]: ProductAccess;
}

/**
 * 单产品访问权限
 */
export interface ProductAccess {
    role: 'admin' | 'editor' | 'viewer' | 'learner';
    permissions?: string[];
}

// ============================================
// 认证状态
// ============================================

/**
 * 认证状态
 */
export interface AuthState {
    user: UnifiedUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    error: AuthError | null;
}

/**
 * 认证错误
 */
export interface AuthError {
    code: string;
    message: string;
    originalError?: unknown;
}

// ============================================
// 认证配置
// ============================================

/**
 * 认证客户端配置
 */
export interface AuthClientConfig {
    supabaseUrl: string;
    supabaseAnonKey: string;
    /**
     * 是否使用代理（用于生产环境）
     */
    useProxy?: boolean;
    /**
     * 代理 URL
     */
    proxyUrl?: string;
    /**
     * 产品 ID（用于权限过滤）
     */
    productId?: string;
    /**
     * 认证完成后的重定向 URL
     */
    redirectUrl?: string;
}

// ============================================
// 认证事件
// ============================================

/**
 * 认证事件类型
 */
export type AuthEventType =
    | 'SIGNED_IN'
    | 'SIGNED_OUT'
    | 'USER_UPDATED'
    | 'PASSWORD_RECOVERY'
    | 'TOKEN_REFRESHED';

/**
 * 认证事件回调
 */
export type AuthEventCallback = (event: AuthEventType, user: UnifiedUser | null) => void;

// ============================================
// 登录凭据
// ============================================

/**
 * 邮箱密码登录凭据
 */
export interface EmailCredentials {
    email: string;
    password: string;
}

/**
 * 注册信息
 */
export interface SignUpData extends EmailCredentials {
    displayName?: string;
    metadata?: Record<string, unknown>;
}

// ============================================
// 令牌类型
// ============================================

/**
 * 统一令牌结构
 */
export interface UnifiedToken {
    userId: string;
    email: string;
    orgId?: string;
    productAccess: ProductAccessMap;
    exp: number;
    iat: number;
}
