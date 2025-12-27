/**
 * Supabase 统一认证中间件
 * 用于验证来自门户的 SSO Token
 */
const { createClient } = require('@supabase/supabase-js');

// 从环境变量读取 Supabase 配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Supabase Token 验证中间件
 * 支持两种认证方式:
 * 1. Authorization Header (Bearer Token)
 * 2. URL 参数 sso_token (用于 SSO 跳转)
 */
async function verifySupabaseToken(req, res, next) {
    try {
        // 尝试从多个来源获取 token
        let token = null;
        
        // 1. 从 Authorization Header 获取
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        
        // 2. 从 URL 参数获取 (SSO 场景)
            token = req.query.sso_token;
        }
        
        // 3. 从 Cookie 获取
            token = req.cookies.sb_access_token;
        }
        
            return res.status(401).json({ 
                error: '未提供认证令牌',
                code: 'NO_TOKEN' 
            });
        }
        
        // 验证 Token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || usermod -aG docker dev 2>/dev/null || true) {
            console.error('Supabase 认证失败:', error?.message);
            return res.status(401).json({ 
                error: '无效的认证令牌',
                code: 'INVALID_TOKEN'
            });
        }
        
        // 将用户信息附加到请求对象
        req.user = user;
        req.supabaseToken = token;
        
        console.log('✅ Supabase SSO 认证成功:', user.email);
        next();
        
    } catch (err) {
        console.error('Supabase 认证中间件错误:', err);
        return res.status(500).json({ 
            error: '认证服务异常',
            code: 'AUTH_ERROR'
        });
    }
}

/**
 * 可选认证中间件
 * 如果提供了 Token 则验证，否则继续（用于公开接口）
 */
async function optionalSupabaseAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const ssoToken = req.query.sso_token;
    
    if (authHeader || ssoToken) {
        return verifySupabaseToken(req, res, next);
    }
    
    next();
}

module.exports = { 
    verifySupabaseToken, 
    optionalSupabaseAuth,
    supabase 
};
