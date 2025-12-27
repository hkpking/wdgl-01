/**
 * 管理员相关路由
 */

const express = require('express');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// 调试接口 - 仅在开发环境且需要管理员权限（安全修复）
if (process.env.NODE_ENV === 'development') {
    router.get('/debug/blocks-schema', authenticateToken, requireAdmin, async (req, res) => {
        try {
            // 检查blocks表结构（仅在开发环境且需要认证）
            const tableInfo = await query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = 'blocks'
                ORDER BY ordinal_position
            `);

            // 检查是否存在必需的字段
            const requiredFields = [
                'id', 'title', 'content', 'type', 'order', 'section_id', 'points', 'is_required',
                'video_url', 'document_url', 'quiz_question', 'quiz_options', 'correct_answer_index', 'content_markdown'
            ];

            const fieldChecks = requiredFields.map(field => ({
                field,
                exists: tableInfo.rows.some(col => col.column_name === field),
                dataType: tableInfo.rows.find(col => col.column_name === field)?.data_type
            }));

            // 查看blocks表的索引
            const indexes = await query(`
                SELECT indexname, indexdef
                FROM pg_indexes
                WHERE tablename = 'blocks'
            `);

            // 查看blocks表的数据示例（移除敏感数据）
            const sampleData = await query('SELECT id, title, type FROM blocks LIMIT 3');

            // 测试数据库连接
            const dbHealth = await query('SELECT 1 as test');

            res.json({
                tableStructure: tableInfo.rows,
                fieldChecks,
                indexes: indexes.rows,
                sampleData: sampleData.rows,
                databaseHealth: dbHealth.rows,
                timestamp: new Date().toISOString(),
                serverInfo: {
                    version: '1.2.5',
                    nodeEnv: process.env.NODE_ENV
                    // 移除数据库URL等敏感信息
                }
            });

        } catch (error) {
            console.error('数据库检查错误:', error);
            res.status(500).json({
                error: '数据库检查失败',
                message: process.env.NODE_ENV === 'development' ? error.message : '内部错误'
                // 移除错误堆栈和敏感信息
            });
        }
    });
}

// 所有管理员路由都需要认证和管理员权限
router.use(authenticateToken);
router.use(requireAdmin);
/**
 * 获取所有篇章（管理员）
 */
router.get('/categories', async (req, res) => {
    try {
        const result = await query(`
            SELECT c.*, 
                   json_agg(
                       json_build_object(
                           'id', ch.id,
                           'title', ch.title,
                           'description', ch.description,
                           'order', ch."order",
                           'sections', COALESCE(sections_data.sections, '[]'::json)
                       ) ORDER BY ch."order"
                   ) as chapters
            FROM categories c
            LEFT JOIN chapters ch ON c.id = ch.category_id
            LEFT JOIN LATERAL (
                SELECT json_agg(
                    json_build_object(
                        'id', s.id,
                        'title', s.title,
                        'order', s."order",
                        'blocks', COALESCE(blocks_data.blocks, '[]'::json)
                    ) ORDER BY s."order"
                ) as sections
                FROM sections s
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'id', b.id,
                            'title', b.title,
                            'order', b."order"
                        ) ORDER BY b."order"
                    ) as blocks
                    FROM blocks b
                    WHERE b.section_id = s.id
                ) blocks_data ON true
                WHERE s.chapter_id = ch.id
            ) sections_data ON true
            GROUP BY c.id, c.title, c.description, c."order", c.created_at
            ORDER BY c."order"
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取篇章列表错误:', error);
        res.status(500).json({
            error: '获取篇章列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新篇章
 */
router.post('/categories', async (req, res) => {
    try {
        const { id, title, description, order } = req.body;

        const result = await query(
            `INSERT INTO categories (id, title, description, "order") 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) 
             DO UPDATE SET 
                 title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 "order" = EXCLUDED."order"
             RETURNING *`,
            [id || require('uuid').v4(), title, description, order || 0]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存篇章错误:', error);
        res.status(500).json({
            error: '保存篇章失败',
            message: error.message
        });
    }
});

/**
 * 删除篇章
 */
router.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query('DELETE FROM categories WHERE id = $1', [id]);

        res.json({
            message: '篇章删除成功'
        });

    } catch (error) {
        console.error('删除篇章错误:', error);
        res.status(500).json({
            error: '删除篇章失败',
            message: error.message
        });
    }
});

/**
 * 获取所有用户
 */
router.get('/users', async (req, res) => {
    try {
        const result = await query(`
            SELECT p.id, p.role, p.faction, p.full_name, p.updated_at,
                   s.username, s.points
            FROM profiles p
            LEFT JOIN scores s ON p.id = s.user_id
            ORDER BY s.points DESC NULLS LAST
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取用户列表错误:', error);
        res.status(500).json({
            error: '获取用户列表失败',
            message: error.message
        });
    }
});

/**
 * 获取系统统计
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await Promise.all([
            query('SELECT COUNT(*) as count FROM categories'),
            query('SELECT COUNT(*) as count FROM chapters'),
            query('SELECT COUNT(*) as count FROM sections'),
            query('SELECT COUNT(*) as count FROM blocks'),
            query('SELECT COUNT(*) as count FROM profiles'),
            query('SELECT COUNT(*) as count FROM scores'),
            query('SELECT SUM(points) as total_points FROM scores')
        ]);

        res.json({
            data: {
                categories: parseInt(stats[0].rows[0].count),
                chapters: parseInt(stats[1].rows[0].count),
                sections: parseInt(stats[2].rows[0].count),
                blocks: parseInt(stats[3].rows[0].count),
                users: parseInt(stats[4].rows[0].count),
                scores: parseInt(stats[5].rows[0].count),
                totalPoints: parseInt(stats[6].rows[0].total_points) || 0
            }
        });

    } catch (error) {
        console.error('获取系统统计错误:', error);
        res.status(500).json({
            error: '获取系统统计失败',
            message: error.message
        });
    }
});

/**
 * 获取所有挑战（管理员）
 */
router.get('/challenges', async (req, res) => {
    try {
        const result = await query(`
            SELECT c.*, 
                   cat.title as target_category_title
            FROM challenges c
            LEFT JOIN categories cat ON c.target_category_id = cat.id
            ORDER BY c.created_at DESC
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取挑战列表错误:', error);
        res.status(500).json({
            error: '获取挑战列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新挑战
 */
router.post('/challenges', async (req, res) => {
    try {
        const { 
            id, 
            title, 
            description, 
            start_date, 
            end_date, 
            target_category_id, 
            reward_points, 
            is_active 
        } = req.body;

        const result = await query(
            `INSERT INTO challenges (
                id, title, description, start_date, end_date, 
                target_category_id, reward_points, is_active
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) 
             DO UPDATE SET 
                 title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 start_date = EXCLUDED.start_date,
                 end_date = EXCLUDED.end_date,
                 target_category_id = EXCLUDED.target_category_id,
                 reward_points = EXCLUDED.reward_points,
                 is_active = EXCLUDED.is_active
             RETURNING *`,
            [
                id || require('uuid').v4(), 
                title, 
                description, 
                start_date, 
                end_date, 
                target_category_id, 
                reward_points || 0, 
                is_active !== false
            ]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存挑战错误:', error);
        res.status(500).json({
            error: '保存挑战失败',
            message: error.message
        });
    }
});

/**
 * 删除挑战
 */
router.delete('/challenges/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query('DELETE FROM challenges WHERE id = $1', [id]);

        res.json({
            message: '挑战删除成功'
        });

    } catch (error) {
        console.error('删除挑战错误:', error);
        res.status(500).json({
            error: '删除挑战失败',
            message: error.message
        });
    }
});

/**
 * 获取所有章节（管理员）
 */
router.get('/chapters', async (req, res) => {
    try {
        const result = await query(`
            SELECT ch.*, 
                   c.title as category_title,
                   json_agg(
                       json_build_object(
                           'id', s.id,
                           'title', s.title,
                           'order', s."order",
                           'blocks', COALESCE(blocks_data.blocks, '[]'::json)
                       ) ORDER BY s."order"
                   ) as sections
            FROM chapters ch
            LEFT JOIN categories c ON ch.category_id = c.id
            LEFT JOIN sections s ON ch.id = s.chapter_id
            LEFT JOIN LATERAL (
                SELECT json_agg(
                    json_build_object(
                        'id', b.id,
                        'title', b.title,
                        'order', b."order"
                    ) ORDER BY b."order"
                ) as blocks
                FROM blocks b
                WHERE b.section_id = s.id
            ) blocks_data ON true
            GROUP BY ch.id, ch.title, ch.description, ch."order", ch.category_id, c.title
            ORDER BY ch."order"
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取章节列表错误:', error);
        res.status(500).json({
            error: '获取章节列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新章节
 */
router.post('/chapters', async (req, res) => {
    try {
        const { id, title, description, order, category_id } = req.body;

        const result = await query(
            `INSERT INTO chapters (id, title, description, "order", category_id) 
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) 
             DO UPDATE SET 
                 title = EXCLUDED.title,
                 description = EXCLUDED.description,
                 "order" = EXCLUDED."order",
                 category_id = EXCLUDED.category_id
             RETURNING *`,
            [id || require('uuid').v4(), title, description, order || 0, category_id]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存章节错误:', error);
        res.status(500).json({
            error: '保存章节失败',
            message: error.message
        });
    }
});

/**
 * 删除章节
 */
router.delete('/chapters/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query('DELETE FROM chapters WHERE id = $1', [id]);

        res.json({
            message: '章节删除成功'
        });

    } catch (error) {
        console.error('删除章节错误:', error);
        res.status(500).json({
            error: '删除章节失败',
            message: error.message
        });
    }
});

/**
 * 获取所有小节（管理员）
 */
router.get('/sections', async (req, res) => {
    try {
        const result = await query(`
            SELECT s.*, 
                   ch.title as chapter_title,
                   c.title as category_title,
                   json_agg(
                       json_build_object(
                           'id', b.id,
                           'title', b.title,
                           'order', b."order"
                       ) ORDER BY b."order"
                   ) as blocks
            FROM sections s
            LEFT JOIN chapters ch ON s.chapter_id = ch.id
            LEFT JOIN categories c ON ch.category_id = c.id
            LEFT JOIN blocks b ON s.id = b.section_id
            GROUP BY s.id, s.title, s."order", s.chapter_id, ch.title, c.title
            ORDER BY s."order"
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取小节列表错误:', error);
        res.status(500).json({
            error: '获取小节列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新小节
 */
router.post('/sections', async (req, res) => {
    try {
        const { id, title, order, chapter_id } = req.body;

        const result = await query(
            `INSERT INTO sections (id, title, "order", chapter_id) 
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) 
             DO UPDATE SET 
                 title = EXCLUDED.title,
                 "order" = EXCLUDED."order",
                 chapter_id = EXCLUDED.chapter_id
             RETURNING *`,
            [id || require('uuid').v4(), title, order || 0, chapter_id]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存小节错误:', error);
        res.status(500).json({
            error: '保存小节失败',
            message: error.message
        });
    }
});

/**
 * 删除小节
 */
router.delete('/sections/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query('DELETE FROM sections WHERE id = $1', [id]);

        res.json({
            message: '小节删除成功'
        });

    } catch (error) {
        console.error('删除小节错误:', error);
        res.status(500).json({
            error: '删除小节失败',
            message: error.message
        });
    }
});

/**
 * 获取所有内容块（管理员）
 */
router.get('/blocks', async (req, res) => {
    try {
        const result = await query(`
            SELECT b.*, 
                   s.title as section_title,
                   ch.title as chapter_title,
                   c.title as category_title
            FROM blocks b
            LEFT JOIN sections s ON b.section_id = s.id
            LEFT JOIN chapters ch ON s.chapter_id = ch.id
            LEFT JOIN categories c ON ch.category_id = c.id
            ORDER BY b."order"
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取内容块列表错误:', error);
        res.status(500).json({
            error: '获取内容块列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新内容块
 */
router.post('/blocks', async (req, res) => {
    try {
        const {
            id,
            title,
            content_markdown,
            content_html, // 新增HTML内容字段
            content_format, // 新增内容格式字段
            content, // 兼容旧版本
            type,
            order,
            section_id,
            points,
            is_required,
            video_url,
            document_url,
            quiz_question,
            quiz_options,
            correct_answer_index
        } = req.body;

        // 使用content_markdown，如果不存在则使用content
        const contentValue = content_markdown !== undefined ? content_markdown : content;

        // 处理测验数据
        const quizData = quiz_question ? {
            quiz_question,
            quiz_options: Array.isArray(quiz_options) ? quiz_options : [quiz_options],
            correct_answer_index: parseInt(correct_answer_index) || 0
        } : null;

        // 验证必需字段
        if (!title) {
            return res.status(400).json({
                error: '标题不能为空',
                message: '请提供内容块标题'
            });
        }
        
        if (!section_id) {
            return res.status(400).json({
                error: '节ID不能为空',
                message: '请选择要添加内容块的节'
            });
        }

        // 首先检查字段是否存在，如果不存在则动态添加
        try {
            // 检查content_html字段
            await query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name = 'blocks' AND column_name = 'content_html') THEN
                        ALTER TABLE blocks ADD COLUMN content_html TEXT;
                    END IF;
                END $$;
            `);
            
            // 检查content_format字段
            await query(`
                DO $$
                BEGIN
                    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                                  WHERE table_name = 'blocks' AND column_name = 'content_format') THEN
                        ALTER TABLE blocks ADD COLUMN content_format VARCHAR(20) DEFAULT 'markdown' NOT NULL;
                    END IF;
                END $$;
            `);
        } catch (fieldError) {
            console.warn('字段检查/添加警告:', fieldError.message);
        }

        const result = await query(
            `INSERT INTO blocks (
                id, title, content_markdown, content_html, content_format, "order", section_id, 
                video_url, document_url, quiz_question, quiz_options, correct_answer_index
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id)
             DO UPDATE SET
                 title = EXCLUDED.title,
                 content_markdown = EXCLUDED.content_markdown,
                 content_html = EXCLUDED.content_html,
                 content_format = EXCLUDED.content_format,
                 "order" = EXCLUDED."order",
                 section_id = EXCLUDED.section_id,
                 video_url = EXCLUDED.video_url,
                 document_url = EXCLUDED.document_url,
                 quiz_question = EXCLUDED.quiz_question,
                 quiz_options = EXCLUDED.quiz_options,
                 correct_answer_index = EXCLUDED.correct_answer_index
             RETURNING *`,
            [
                id || require('uuid').v4(),
                title,
                contentValue,
                content_html || null,
                content_format || 'markdown',
                order || 0,
                section_id,
                video_url || null,
                document_url || null,
                quiz_question || null,
                quizData ? JSON.stringify(quizData.quiz_options) : null,
                quizData ? quizData.correct_answer_index : null
            ]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存内容块错误:', error);
        console.error('请求数据:', req.body);
        console.error('错误详情:', {
            message: error.message,
            code: error.code,
            detail: error.detail,
            hint: error.hint
        });
        res.status(500).json({
            error: '保存内容块失败',
            message: error.message,
            details: error.detail || error.hint || '未知错误'
        });
    }
});



/**
 * 删除内容块
 */
router.delete('/blocks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await query('DELETE FROM blocks WHERE id = $1', [id]);

        res.json({
            message: '内容块删除成功'
        });

    } catch (error) {
        console.error('删除内容块错误:', error);
        res.status(500).json({
            error: '删除内容块失败',
            message: error.message
        });
    }
});

/**
 * 获取所有阵营（管理员）
 */
router.get('/factions', async (req, res) => {
    try {
        const result = await query(`
            SELECT * FROM public.factions
            ORDER BY sort_order ASC, created_at ASC
        `);

        res.json({
            data: result.rows
        });

    } catch (error) {
        console.error('获取阵营列表错误:', error);
        res.status(500).json({
            error: '获取阵营列表失败',
            message: error.message
        });
    }
});

/**
 * 创建/更新阵营
 */
router.post('/factions', async (req, res) => {
    try {
        const { 
            id, 
            code, 
            name, 
            description, 
            color, 
            is_active, 
            sort_order 
        } = req.body;

        const result = await query(
            `INSERT INTO public.factions (
                id, code, name, description, color, is_active, sort_order
            ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) 
             DO UPDATE SET 
                 code = EXCLUDED.code,
                 name = EXCLUDED.name,
                 description = EXCLUDED.description,
                 color = EXCLUDED.color,
                 is_active = EXCLUDED.is_active,
                 sort_order = EXCLUDED.sort_order,
                 updated_at = NOW()
             RETURNING *`,
            [
                id || require('uuid').v4(), 
                code, 
                name, 
                description, 
                color, 
                is_active !== false, 
                sort_order || 0
            ]
        );

        res.json({
            data: result.rows[0]
        });

    } catch (error) {
        console.error('保存阵营错误:', error);
        res.status(500).json({
            error: '保存阵营失败',
            message: error.message
        });
    }
});

/**
 * 删除阵营
 */
router.delete('/factions/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 检查是否有用户使用此阵营
        const userCount = await query(
            'SELECT COUNT(*) as count FROM public.profiles WHERE faction = (SELECT code FROM public.factions WHERE id = $1)',
            [id]
        );

        if (parseInt(userCount.rows[0].count) > 0) {
            return res.status(400).json({
                error: '无法删除阵营',
                message: '该阵营下还有用户，请先转移用户到其他阵营'
            });
        }

        await query('DELETE FROM public.factions WHERE id = $1', [id]);

        res.json({
            message: '阵营删除成功'
        });

    } catch (error) {
        console.error('删除阵营错误:', error);
        res.status(500).json({
            error: '删除阵营失败',
            message: error.message
        });
    }
});

module.exports = router;
