/**
 * SSO 统一认证处理器 (Supabase 直连版)
 * 与门户共享 Supabase 认证，无需后端中间层
 * 
 * 工作流程：
 * 1. 用户从门户点击"流程天命人"链接
 * 2. 门户携带 sso_token 跳转到 LCTMR
 * 3. LCTMR 使用此 token 设置 Supabase session
 * 4. 用户自动登录，共享门户的登录状态
 */

(function () {
    'use strict';

    const SSO_TOKEN_PARAM = 'sso_token';
    const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

    // 等待 Supabase 加载
    let supabaseClient = null;

    function getSupabaseClient() {
        if (!supabaseClient && window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
        return supabaseClient;
    }

    /**
     * 检查 URL 中是否有 SSO Token
     */
    function getSSOToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(SSO_TOKEN_PARAM);
    }

    /**
     * 清理 URL 中的 SSO Token（安全考虑）
     */
    function cleanupURL() {
        const url = new URL(window.location.href);
        url.searchParams.delete(SSO_TOKEN_PARAM);
        window.history.replaceState({}, document.title, url.pathname + url.search);
    }

    /**
     * 使用 Supabase 直接验证 SSO Token
     */
    async function performSSOLogin(ssoToken) {
        try {

            const client = getSupabaseClient();
            if (!client) {
                console.error('❌ Supabase 客户端未初始化');
                return false;
            }

            // 使用 token 获取用户信息
            const { data: { user }, error: userError } = await client.auth.getUser(ssoToken);

            if (userError || !user) {
                console.error('❌ SSO Token 验证失败:', userError?.message);
                cleanupURL();
                return false;
            }


            // 设置 session（使 Supabase 客户端保持登录状态）
            // 注意：这需要 refresh_token，如果只有 access_token 则需要其他方式
            // 方案1：使用 setSession（需要 access_token 和 refresh_token）
            // 方案2：保存用户信息到 localStorage，让应用使用

            // 检查/创建 LCTMR 用户档案
            const { data: profile } = await client
                .from('lctmr_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profile) {
                // 首次登录，创建 LCTMR 档案
                await client.from('lctmr_profiles').insert({
                    id: user.id,
                    display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
                });
            }

            // 保存用户信息到 localStorage（兼容旧代码）
            const userData = {
                id: user.id,
                email: user.email,
                fullName: user.user_metadata?.display_name || user.email?.split('@')[0],
                ...profile
            };

            localStorage.setItem('user_data', JSON.stringify(userData));
            localStorage.setItem('auth_token', ssoToken); // 保存 token 供后续 API 调用
            localStorage.setItem('sso_authenticated', 'true');

            // 触发自定义事件，通知应用用户已登录
            window.dispatchEvent(new CustomEvent('sso-login-success', {
                detail: userData
            }));

            // 清理 URL
            cleanupURL();


            return true;

        } catch (err) {
            console.error('❌ SSO 登录请求失败:', err);
            cleanupURL();
            return false;
        }
    }

    /**
     * 检查当前是否已登录
     */
    async function checkAuth() {
        const client = getSupabaseClient();
        if (!client) return null;

        const { data: { user } } = await client.auth.getUser();
        return user;
    }

    /**
     * 退出登录
     */
    async function signOut() {
        const client = getSupabaseClient();
        if (client) {
            await client.auth.signOut();
        }
        localStorage.removeItem('user_data');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('sso_authenticated');
    }

    /**
     * 跳转到门户登录页
     */
    function redirectToPortalLogin() {
        const portalUrl = 'https://bpm-auto.com/portal/login';
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `${portalUrl}?redirect=${returnUrl}`;
    }

    /**
     * 初始化 SSO 处理
     */
    async function initSSO() {
        const ssoToken = getSSOToken();

        if (ssoToken) {
            const success = await performSSOLogin(ssoToken);
            if (success) {
                // 登录成功，刷新页面加载用户数据
                window.location.reload();
            }
        } else {
            // 检查是否有本地登录状态
            const localUser = localStorage.getItem('user_data');
            if (localUser) {
                window.dispatchEvent(new CustomEvent('sso-login-success', {
                    detail: JSON.parse(localUser)
                }));
            }
        }
    }

    // 等待 DOM 和 Supabase 库加载完成后初始化
    function waitForSupabase(callback, maxAttempts = 20) {
        let attempts = 0;
        const check = () => {
            if (window.supabase) {
                callback();
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(check, 100);
            } else {
                console.error('❌ Supabase 库未加载');
            }
        };
        check();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            waitForSupabase(initSSO);
        });
    } else {
        waitForSupabase(initSSO);
    }

    // 导出函数供手动调用
    window.SSOHandler = {
        init: initSSO,
        getSSOToken: getSSOToken,
        performSSOLogin: performSSOLogin,
        checkAuth: checkAuth,
        signOut: signOut,
        redirectToPortalLogin: redirectToPortalLogin,
        getSupabaseClient: getSupabaseClient,
    };

})();
