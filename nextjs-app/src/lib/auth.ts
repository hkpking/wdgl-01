import Cookies from 'js-cookie';

// Auth User Type
export interface User {
    id: string;
    email: string;
    name: string;
}

// Mock User
export const MOCK_USER: User = {
    id: 'mock_user_001',
    email: 'demo@example.com',
    name: '演示用户'
};

const COOKIE_NAME = 'wdgl_auth_token';

/**
 * 模拟认证服务
 */
export const authService = {
    // 登录
    signIn: async (email: string, password: string): Promise<User> => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 简单的验证逻辑 (实际应调用 API)
        if (email && password.length >= 6) {
            const user = { ...MOCK_USER, email };

            // 设置 Cookie (Mock Token)
            Cookies.set(COOKIE_NAME, 'mock_token_' + Date.now(), { expires: 7 }); // 7天过期

            // 保存用户信息到 localStorage (可选，用于快速读取)
            if (typeof window !== 'undefined') {
                localStorage.setItem('wdgl_user', JSON.stringify(user));
            }

            return user;
        }

        throw new Error('邮箱或密码错误');
    },

    // 注册
    signUp: async (email: string, password: string, name?: string): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email && password.length >= 6) {
            const user = {
                id: 'user_' + Date.now().toString(36),
                email,
                name: name || email.split('@')[0]
            };

            Cookies.set(COOKIE_NAME, 'mock_token_' + Date.now(), { expires: 7 });

            if (typeof window !== 'undefined') {
                localStorage.setItem('wdgl_user', JSON.stringify(user));
            }

            return user;
        }

        throw new Error('注册失败');
    },

    // 登出
    signOut: async () => {
        Cookies.remove(COOKIE_NAME);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('wdgl_user');
        }
    },

    // 获取当前用户 (客户端)
    getCurrentUser: (): User | null => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('wdgl_user');
            const token = Cookies.get(COOKIE_NAME);

            if (userStr && token) {
                try {
                    return JSON.parse(userStr);
                } catch {
                    return null;
                }
            }
        }
        return null;
    }
};
