/**
 * @file conversation.js
 * @description 对话学习相关API路由
 * @version 1.0.0
 * @author LCTMR Team
 */

const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { authenticateToken: auth } = require('../middleware/auth');

const router = express.Router();

/**
 * 获取用户的对话学习进度
 * GET /api/conversation/progress/:blockId
 */
router.get('/progress/:blockId', 
    auth,
    [
        param('blockId').notEmpty().withMessage('内容块ID不能为空')
    ],
    async (req, res) => {
        try {
            // 验证参数
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: '参数验证失败',
                    errors: errors.array()
                });
            }

            const { blockId } = req.params;
            const userId = req.user.id;

            // 查询用户的对话学习进度
            const query = `
                SELECT 
                    id,
                    user_id,
                    content_block_id,
                    current_step,
                    total_steps,
                    progress_percentage,
                    points_earned,
                    completed_tests,
                    is_completed,
                    conversation_data,
                    created_at,
                    updated_at,
                    last_accessed_at
                FROM conversation_progress 
                WHERE user_id = $1 AND content_block_id = $2
                ORDER BY updated_at DESC
                LIMIT 1
            `;

            const result = await getPool().query(query, [userId, blockId]);

            if (result.rows.length === 0) {
                return res.json({
                    success: true,
                    data: null,
                    message: '未找到学习进度记录'
                });
            }

            const progress = result.rows[0];

            // 转换数据格式
            const progressData = {
                blockId: progress.content_block_id,
                currentStep: progress.current_step,
                totalSteps: progress.total_steps,
                progress: progress.progress_percentage,
                pointsEarned: progress.points_earned,
                completedTests: progress.completed_tests || [],
                isComplete: progress.is_completed,
                lastAccessedAt: progress.last_accessed_at,
                conversationData: progress.conversation_data
            };

            // 更新最后访问时间
            await getPool().query(
                'UPDATE conversation_progress SET last_accessed_at = NOW() WHERE id = $1',
                [progress.id]
            );

            res.json({
                success: true,
                data: progressData,
                message: '获取学习进度成功'
            });

        } catch (error) {
            console.error('获取对话学习进度失败:', error);
            res.status(500).json({
                success: false,
                message: '获取学习进度失败',
                error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
            });
        }
    }
);

/**
 * 保存用户的对话学习进度
 * POST /api/conversation/progress
 */
router.post('/progress',
    auth,
    [
        body('blockId').notEmpty().withMessage('内容块ID不能为空'),
        body('currentStep').isInt({ min: 0 }).withMessage('当前步骤必须是非负整数'),
        body('totalSteps').isInt({ min: 1 }).withMessage('总步骤数必须是正整数'),
        body('progress').isInt({ min: 0, max: 100 }).withMessage('进度必须是0-100之间的整数'),
        body('pointsEarned').isInt({ min: 0 }).withMessage('获得积分必须是非负整数'),
        body('completedTests').optional().isArray().withMessage('已完成测试必须是数组'),
        body('isComplete').optional().isBoolean().withMessage('完成状态必须是布尔值')
    ],
    async (req, res) => {
        try {
            // 验证参数
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: '参数验证失败',
                    errors: errors.array()
                });
            }

            const userId = req.user.id;
            const {
                blockId,
                currentStep,
                totalSteps,
                progress,
                pointsEarned,
                completedTests = [],
                isComplete = false,
                conversationData = null
            } = req.body;

            // 检查是否已存在进度记录
            const existingQuery = `
                SELECT id FROM conversation_progress 
                WHERE user_id = $1 AND content_block_id = $2
            `;
            const existingResult = await getPool().query(existingQuery, [userId, blockId]);

            let query;
            let values;
            let result;

            if (existingResult.rows.length > 0) {
                // 更新现有记录
                query = `
                    UPDATE conversation_progress SET
                        current_step = $3,
                        total_steps = $4,
                        progress_percentage = $5,
                        points_earned = $6,
                        completed_tests = $7,
                        is_completed = $8,
                        conversation_data = $9,
                        updated_at = NOW(),
                        last_accessed_at = NOW()
                    WHERE user_id = $1 AND content_block_id = $2
                    RETURNING id, updated_at
                `;
                values = [
                    userId, 
                    blockId, 
                    currentStep, 
                    totalSteps, 
                    progress, 
                    pointsEarned,
                    JSON.stringify(completedTests),
                    isComplete,
                    conversationData ? JSON.stringify(conversationData) : null
                ];
            } else {
                // 插入新记录
                query = `
                    INSERT INTO conversation_progress (
                        user_id,
                        content_block_id,
                        current_step,
                        total_steps,
                        progress_percentage,
                        points_earned,
                        completed_tests,
                        is_completed,
                        conversation_data,
                        created_at,
                        updated_at,
                        last_accessed_at
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
                    RETURNING id, created_at
                `;
                values = [
                    userId,
                    blockId,
                    currentStep,
                    totalSteps,
                    progress,
                    pointsEarned,
                    JSON.stringify(completedTests),
                    isComplete,
                    conversationData ? JSON.stringify(conversationData) : null
                ];
            }

            result = await getPool().query(query, values);

            // 如果学习完成，更新用户的总积分和成就
            if (isComplete && pointsEarned > 0) {
                await updateUserStats(userId, pointsEarned, blockId);
            }

            res.json({
                success: true,
                data: {
                    id: result.rows[0].id,
                    blockId,
                    currentStep,
                    progress,
                    pointsEarned,
                    isComplete
                },
                message: '保存学习进度成功'
            });

        } catch (error) {
            console.error('保存对话学习进度失败:', error);
            res.status(500).json({
                success: false,
                message: '保存学习进度失败',
                error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
            });
        }
    }
);

/**
 * 获取用户的对话学习统计信息
 * GET /api/conversation/stats
 */
router.get('/stats',
    auth,
    async (req, res) => {
        try {
            const userId = req.user.id;

            const query = `
                SELECT 
                    COUNT(*) as total_conversations,
                    COUNT(*) FILTER (WHERE is_completed = true) as completed_conversations,
                    COALESCE(SUM(points_earned), 0) as total_points,
                    COALESCE(AVG(progress_percentage), 0) as average_progress,
                    COUNT(DISTINCT content_block_id) as unique_blocks
                FROM conversation_progress 
                WHERE user_id = $1
            `;

            const result = await getPool().query(query, [userId]);
            const stats = result.rows[0];

            // 计算完成率
            const completionRate = stats.total_conversations > 0 
                ? Math.round((stats.completed_conversations / stats.total_conversations) * 100)
                : 0;

            res.json({
                success: true,
                data: {
                    totalConversations: parseInt(stats.total_conversations),
                    completedConversations: parseInt(stats.completed_conversations),
                    totalPoints: parseInt(stats.total_points),
                    averageProgress: Math.round(parseFloat(stats.average_progress)),
                    uniqueBlocks: parseInt(stats.unique_blocks),
                    completionRate
                },
                message: '获取统计信息成功'
            });

        } catch (error) {
            console.error('获取对话学习统计失败:', error);
            res.status(500).json({
                success: false,
                message: '获取统计信息失败',
                error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
            });
        }
    }
);

/**
 * 删除用户的对话学习进度（重置）
 * DELETE /api/conversation/progress/:blockId
 */
router.delete('/progress/:blockId',
    auth,
    [
        param('blockId').notEmpty().withMessage('内容块ID不能为空')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: '参数验证失败',
                    errors: errors.array()
                });
            }

            const { blockId } = req.params;
            const userId = req.user.id;

            const query = `
                DELETE FROM conversation_progress 
                WHERE user_id = $1 AND content_block_id = $2
                RETURNING id
            `;

            const result = await getPool().query(query, [userId, blockId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: '未找到要删除的进度记录'
                });
            }

            res.json({
                success: true,
                message: '重置学习进度成功'
            });

        } catch (error) {
            console.error('重置对话学习进度失败:', error);
            res.status(500).json({
                success: false,
                message: '重置学习进度失败',
                error: process.env.NODE_ENV === 'development' ? error.message : '服务器内部错误'
            });
        }
    }
);

/**
 * 更新用户统计信息
 */
async function updateUserStats(userId, earnedPoints, blockId) {
    try {
        // 更新用户总积分
        await getPool().query(`
            UPDATE users SET 
                total_points = COALESCE(total_points, 0) + $2,
                updated_at = NOW()
            WHERE id = $1
        `, [userId, earnedPoints]);

        // 记录积分获得历史
        await getPool().query(`
            INSERT INTO user_points_history (
                user_id, 
                points, 
                source_type, 
                source_id, 
                description, 
                created_at
            ) VALUES ($1, $2, 'conversation_learning', $3, '对话学习完成奖励', NOW())
        `, [userId, earnedPoints, blockId]);

        console.log(`✅ 用户 ${userId} 通过对话学习获得 ${earnedPoints} 积分`);

    } catch (error) {
        console.error('更新用户统计信息失败:', error);
        // 不抛出错误，避免影响主流程
    }
}

module.exports = router;