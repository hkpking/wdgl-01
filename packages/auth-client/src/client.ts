/**
 * 统一认证客户端
 * @wdgl/auth-client
 * 
 * 提供跨产品的统一认证能力，基于 Supabase Auth 实现
 */
import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import type {
    User,
    UnifiedUser,
    AuthState,
    AuthError,
    AuthClientConfig,
    AuthEventCallback,
    AuthEventType,
    EmailCredentials,
    SignUpData,
    ProductAccessMap,
} from './types';

/**
 * 统一认证客户端
 * 提供多产品共享的认证能力
 */
export class UnifiedAuthClient {
    private supabase: SupabaseClient;
    private config: AuthClientConfig;
    private listeners: Set<AuthEventCallback> = new Set();
    private currentUser: UnifiedUser | null = null;

    constructor(config: AuthClientConfig) {
        this.config = config;

        // 根据配置选择 URL
        const url = config.useProxy && config.proxyUrl
            ? config.proxyUrl
            : config.supabaseUrl;

        this.supabase = createClient(url, config.supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
            },
        });

        // 监听认证状态变化
        this.supabase.auth.onAuthStateChange((event, session) => {
            this.handleAuthStateChange(event, session);
        });
    }

    // ============================================
    // 公共方法
    // ============================================

    /**
     * 邮箱密码登录
     */
    async signIn(credentials: EmailCredentials): Promise<UnifiedUser> {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) {
            throw this.createAuthError('SIGN_IN_FAILED', error.message, error);
        }

        const user = this.mapToUnifiedUser(data.user);
        this.currentUser = user;
        this.notifyListeners('SIGNED_IN', user);

        return user;
    }

    /**
     * 邮箱密码注册
     */
    async signUp(data: SignUpData): Promise<UnifiedUser> {
        const { data: authData, error } = await this.supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    display_name: data.displayName || data.email.split('@')[0],
                    ...data.metadata,
                },
            },
        });

        if (error) {
            throw this.createAuthError('SIGN_UP_FAILED', error.message, error);
        }

        if (!authData.user) {
            throw this.createAuthError('SIGN_UP_FAILED', '注册失败，用户创建异常');
        }

        return this.mapToUnifiedUser(authData.user);
    }

    /**
     * 登出
     */
    async signOut(): Promise<void> {
        const { error } = await this.supabase.auth.signOut();

        if (error) {
            throw this.createAuthError('SIGN_OUT_FAILED', error.message, error);
        }

        this.currentUser = null;
        this.notifyListeners('SIGNED_OUT', null);
    }

    /**
     * 获取当前用户
     */
    async getUser(): Promise<UnifiedUser | null> {
        const { data: { user }, error } = await this.supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        const unifiedUser = this.mapToUnifiedUser(user);
        this.currentUser = unifiedUser;
        return unifiedUser;
    }

    /**
     * 获取当前用户（同步，使用缓存）
     */
    getCurrentUser(): UnifiedUser | null {
        return this.currentUser;
    }

    /**
     * 获取认证状态
     */
    async getAuthState(): Promise<AuthState> {
        try {
            const user = await this.getUser();
            return {
                user,
                loading: false,
                isAuthenticated: !!user,
                error: null,
            };
        } catch (error) {
            return {
                user: null,
                loading: false,
                isAuthenticated: false,
                error: error as AuthError,
            };
        }
    }

    /**
     * 检查产品访问权限
     */
    async hasProductAccess(productId: string): Promise<boolean> {
        const user = await this.getUser();
        if (!user || !user.productAccess) {
            return false;
        }
        return productId in user.productAccess;
    }

    /**
     * 获取产品访问权限
     */
    async getProductAccess(productId: string): Promise<ProductAccessMap[string] | null> {
        const user = await this.getUser();
        if (!user || !user.productAccess) {
            return null;
        }
        return user.productAccess[productId] || null;
    }

    /**
     * 监听认证状态变化
     */
    onAuthStateChange(callback: AuthEventCallback): () => void {
        this.listeners.add(callback);

        // 返回取消订阅函数
        return () => {
            this.listeners.delete(callback);
        };
    }

    /**
     * 获取 Session Token（用于跨产品认证）
     */
    async getAccessToken(): Promise<string | null> {
        const { data: { session } } = await this.supabase.auth.getSession();
        return session?.access_token || null;
    }

    /**
     * 刷新 Token
     */
    async refreshToken(): Promise<void> {
        const { error } = await this.supabase.auth.refreshSession();
        if (error) {
            throw this.createAuthError('TOKEN_REFRESH_FAILED', error.message, error);
        }
        this.notifyListeners('TOKEN_REFRESHED', this.currentUser);
    }

    /**
     * 跨产品导航（带认证上下文）
     */
    async navigateToProduct(productId: string, path: string = '/'): Promise<string> {
        const token = await this.getAccessToken();
        if (!token) {
            throw this.createAuthError('NOT_AUTHENTICATED', '请先登录');
        }

        // 构建目标 URL（根据产品配置）
        const baseUrl = this.getProductBaseUrl(productId);
        const url = new URL(path, baseUrl);

        // 添加认证参数（短期令牌）
        url.searchParams.set('auth_token', token);

        return url.toString();
    }

    /**
     * 获取 Supabase 客户端（用于高级操作）
     */
    getSupabaseClient(): SupabaseClient {
        return this.supabase;
    }

    // ============================================
    // 私有方法
    // ============================================

    /**
     * 处理认证状态变化
     */
    private handleAuthStateChange(event: AuthChangeEvent, session: Session | null): void {
        let eventType: AuthEventType;

        switch (event) {
            case 'SIGNED_IN':
                eventType = 'SIGNED_IN';
                break;
            case 'SIGNED_OUT':
                eventType = 'SIGNED_OUT';
                this.currentUser = null;
                break;
            case 'USER_UPDATED':
                eventType = 'USER_UPDATED';
                break;
            case 'PASSWORD_RECOVERY':
                eventType = 'PASSWORD_RECOVERY';
                break;
            case 'TOKEN_REFRESHED':
                eventType = 'TOKEN_REFRESHED';
                break;
            default:
                return;
        }

        if (session?.user) {
            this.currentUser = this.mapToUnifiedUser(session.user);
        }

        this.notifyListeners(eventType, this.currentUser);
    }

    /**
     * 通知所有监听器
     */
    private notifyListeners(event: AuthEventType, user: UnifiedUser | null): void {
        this.listeners.forEach(callback => {
            try {
                callback(event, user);
            } catch (error) {
                console.error('[AuthClient] Listener error:', error);
            }
        });
    }

    /**
     * 将 Supabase 用户映射为统一用户
     */
    private mapToUnifiedUser(user: any): UnifiedUser {
        return {
            uid: user.id,
            email: user.email,
            displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
            orgId: user.user_metadata?.org_id,
            productAccess: user.user_metadata?.product_access || this.getDefaultProductAccess(),
        };
    }

    /**
     * 获取默认产品访问权限
     */
    private getDefaultProductAccess(): ProductAccessMap {
        // 如果配置了产品 ID，默认给予该产品的基本访问权限
        if (this.config.productId) {
            return {
                [this.config.productId]: { role: 'viewer' },
            };
        }
        return {};
    }

    /**
     * 获取产品基础 URL
     */
    private getProductBaseUrl(productId: string): string {
        // 可以从配置或注册表中获取
        const productUrls: Record<string, string> = {
            docs: '/docs',
            learning: '/learning',
        };
        return productUrls[productId] || '/';
    }

    /**
     * 创建认证错误
     */
    private createAuthError(code: string, message: string, originalError?: unknown): AuthError {
        return {
            code,
            message,
            originalError,
        };
    }
}
