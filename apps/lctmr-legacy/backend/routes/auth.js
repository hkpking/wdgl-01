/**
 * 认证相关路由
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * 用户注册
 */
router.post('/signup', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty().trim()
], async (req, res) => {
    try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '输入参数错误',
                details: errors.array()
            });
        }

        const { email, password, fullName } = req.body;

        // 检查用户是否已存在
        const existingUser = await query(
            'SELECT id FROM auth.users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: '用户已存在'
            });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 12);

        // 开始事务
        const client = await require('../config/database').getClient();
        await client.query('BEGIN');

        try {
            // 使用数据库生成UUID，确保唯一性
            let userIdResult = await client.query('SELECT gen_random_uuid() as id');
            let userId = userIdResult.rows[0].id;
            
            console.log('🔍 生成用户ID:', { userId, email });
            
            // 再次检查这个ID是否已存在
            const checkUser = await client.query('SELECT id FROM auth.users WHERE id = $1', [userId]);
            const checkProfile = await client.query('SELECT id FROM public.profiles WHERE id = $1', [userId]);
            
            if (checkUser.rows.length > 0 || checkProfile.rows.length > 0) {
                console.log('⚠️ 生成的UUID已存在，重新生成');
                userIdResult = await client.query('SELECT gen_random_uuid() as id');
                userId = userIdResult.rows[0].id;
                console.log('🔍 重新生成用户ID:', { userId, email });
            }

            // 先创建用户记录
            console.log('🔍 创建用户记录:', { userId, email });
            const userResult = await client.query(
                'INSERT INTO auth.users (id, email, encrypted_password) VALUES ($1, $2, $3) RETURNING id',
                [userId, email, hashedPassword]
            );
            console.log('✅ 用户记录创建成功:', userResult.rows[0]);

            // 等待触发器自动创建用户档案，然后更新
            console.log('🔍 等待触发器创建用户档案...');
            await new Promise(resolve => setTimeout(resolve, 100)); // 等待100ms让触发器执行
            
            // 更新用户档案信息（触发器已自动创建profile、scores和user_progress）
            console.log('🔍 更新用户档案:', { userId, fullName });
            // 等待触发器执行完成
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // 更新用户档案的full_name（触发器已创建profile但full_name为NULL）
            const profileResult = await client.query(
                'UPDATE public.profiles SET full_name = $1 WHERE id = $2 RETURNING id',
                [fullName, userId]
            );
            console.log('✅ 用户档案更新成功:', profileResult.rows[0]);
            
            // 注意：触发器 handle_new_user 已自动创建：
            // - public.profiles
            // - public.scores  
            // - public.user_progress
            // 所以不需要手动创建这些记录

            // 提交事务
            await client.query('COMMIT');

            // 生成JWT令牌
            const token = jwt.sign(
                { 
                    userId, 
                    email, 
                    fullName,
                    role: 'user' 
                },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.status(201).json({
                data: {
                    user: {
                        id: userId,
                        email: email,
                        fullName: fullName,
                        role: 'user'
                    },
                    token: token
                }
            });

        } catch (error) {
            await client.query('ROLLBACK');
            console.log('注册错误详情:', {
                message: error.message,
                code: error.code,
                detail: error.detail,
                constraint: error.constraint,
                table: error.table
            });
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            error: '注册失败',
            message: error.message
        });
    }
});

/**
 * 用户登录
 */
router.post('/signin', [
    body('email').notEmpty().trim(),
    body('password').notEmpty()
], async (req, res) => {
    try {
        // 验证输入
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: '输入参数错误',
                details: errors.array()
            });
        }

        const { email, password } = req.body;

        // 查找用户（包含密码哈希）
        // 支持多种登录方式：邮箱、用户名、真实姓名
        const userResult = await query(
            `SELECT u.id, u.email, u.encrypted_password as encrypted_password, p.role, p.full_name, p.faction, s.points, s.username
             FROM auth.users u
             LEFT JOIN public.profiles p ON u.id = p.id
             LEFT JOIN public.scores s ON u.id = s.user_id 
             WHERE u.email = $1`,
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                error: '用户名或密码错误'
            });
        }

        const user = userResult.rows[0];

        // 验证密码 - 强制要求有效密码（安全修复：移除密码验证绕过逻辑）
        if (!user.encrypted_password || user.encrypted_password === 'dummy_hash') {
            return res.status(401).json({
                error: '账户需要设置密码，请使用密码重置功能'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.encrypted_password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: '用户名或密码错误'
            });
        }
        
        // 生成JWT令牌
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.full_name || user.username,
                fullName: user.full_name,
                role: user.role,
                faction: user.faction
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            data: {
                user: {
                    id: user.id,
                    email: user.full_name || user.username,
                    fullName: user.full_name,
                    role: user.role,
                    faction: user.faction,
                    points: user.points || 0
                },
                token: token
            }
        });

    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            error: '登录失败',
            message: error.message
        });
    }
});

/**
 * 获取当前用户信息
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await query(
            `SELECT p.id, p.role, p.full_name, p.faction, s.username, s.points
             FROM profiles p 
             LEFT JOIN scores s ON p.id = s.user_id 
             WHERE p.id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: '用户不存在'
            });
        }

        const user = result.rows[0];
        res.json({
            data: {
                user: {
                    id: user.id,
                    email: user.full_name || user.username,
                    fullName: user.full_name,
                    role: user.role,
                    faction: user.faction,
                    points: user.points || 0
                }
            }
        });

    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            error: '获取用户信息失败',
            message: error.message
        });
    }
});

/**
 * 用户退出（客户端处理，这里只是返回成功）
 */
router.post('/signout', (req, res) => {
    res.json({
        message: '退出成功'
    });
});

/**
 * 验证令牌
 */
router.post('/verify', authenticateToken, (req, res) => {
    res.json({
        valid: true,
        user: req.user
    });
});

module.exports = router;

// ==================== SSO 统一认证 ====================

const { verifySupabaseToken, supabase } = require('../middleware/supabaseAuth');

/**
 * SSO 登录端点
 * 验证门户传来的 Supabase Token，并创建本地会话
 * POST /api/auth/sso-login
 */
router.post('/sso-login', async (req, res) => {
    try {
        const { token } = req.body;
        
            return res.status(400).json({ error: '缺少认证令牌' });
        }
        
        // 使用 Supabase 验证 Token
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || usermod -aG docker dev 2>/dev/null || true) {
            console.error('SSO 认证失败:', error?.message);
            return res.status(401).json({ error: '无效的 SSO 令牌' });
        }
        
        // 查找或创建本地用户
        let localUser = await query(
            'SELECT id, email, full_name, faction_id, credits, total_credits, level FROM auth.users WHERE email = $1',
            [user.email]
        );
        
        if (localUser.rows.length === 0) {
            // 首次 SSO 登录，自动创建本地用户
            const newUser = await query(
                'INSERT INTO auth.users (id, email, full_name, created_at, updated_at) VALUES (gen_random_uuid(), $1, $2, NOW(), NOW()) RETURNING id, email, full_name, faction_id, credits, total_credits, level',
                [user.email, user.user_metadata?.full_name || user.email.split('@')[0]]
            );
            localUser = newUser;
            console.log('✅ SSO 新用户创建:', user.email);
        }
        
        const userData = localUser.rows[0];
        
        // 生成本地 JWT Token
        const localToken = jwt.sign(
            { 
                userId: userData.id, 
                email: userData.email,
                sso: true  // 标记为 SSO 登录
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        console.log('✅ SSO 登录成功:', user.email);
        
        res.json({
            success: true,
            message: 'SSO 登录成功',
            token: localToken,
            user: {
                id: userData.id,
                email: userData.email,
                fullName: userData.full_name,
                factionId: userData.faction_id,
                credits: userData.credits || 0,
                totalCredits: userData.total_credits || 0,
                level: userData.level || 1
            }
        });
        
    } catch (err) {
        console.error('SSO 登录错误:', err);
        res.status(500).json({ error: '服务器错误' });
    }
});

/**
 * 验证 SSO Token (用于前端检查)
 * GET /api/auth/verify-sso?token=xxx
 */
router.get('/verify-sso', async (req, res) => {
    try {
        const token = req.query.token;
        
            return res.status(400).json({ valid: false, error: '缺少令牌' });
        }
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || usermod -aG docker dev 2>/dev/null || true) {
            return res.json({ valid: false, error: '令牌无效或已过期' });
        }
        
        res.json({ 
            valid: true, 
            user: { 
                email: user.email, 
                id: user.id 
            } 
        });
        
    } catch (err) {
        console.error('验证 SSO Token 错误:', err);
        res.status(500).json({ valid: false, error: '服务器错误' });
    }
});

