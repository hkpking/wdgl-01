/**
 * @file ai.js
 * @description AI服务路由 - 处理AI生成请求
 * @version 1.0.0
 */

const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 所有AI接口都需要认证（安全修复）
router.use(authenticateToken);

/**
 * AI对话生成接口
 * POST /api/ai/chat
 */
router.post('/chat', async (req, res) => {
    try {
        const { prompt, temperature = 0.7, max_tokens = 2000, model = 'gpt-3.5-turbo' } = req.body;

        // 验证输入
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                error: '无效的提示词',
                message: 'prompt字段必须是非空字符串'
            });
        }

        // 限制提示词长度
        if (prompt.length > 10000) {
            return res.status(400).json({
                error: '提示词过长',
                message: '提示词不能超过10000字符'
            });
        }

        // 这里需要根据实际使用的AI服务进行调整
        // 示例1: 使用OpenAI API
        if (process.env.OPENAI_API_KEY) {
            const content = await callOpenAI(prompt, { temperature, max_tokens, model });
            return res.json({ content });
        }

        // 示例2: 使用自定义AI服务
        if (process.env.CUSTOM_AI_ENDPOINT) {
            const content = await callCustomAI(prompt, { temperature, max_tokens, model });
            return res.json({ content });
        }

        // 如果没有配置AI服务，返回模拟数据（仅用于开发测试）
        console.warn('⚠️ 未配置AI服务，返回模拟数据');
        const mockContent = generateMockResponse(prompt);
        return res.json({ 
            content: mockContent,
            _isMock: true 
        });

    } catch (error) {
        console.error('AI生成错误:', error);
        res.status(500).json({
            error: 'AI生成失败',
            message: error.message
        });
    }
});

/**
 * AI对话生成接口 - 流式响应
 * POST /api/ai/chat/stream
 */
router.post('/chat/stream', async (req, res) => {
    try {
        const { prompt, temperature = 0.7, max_tokens = 2000, model = 'gpt-3.5-turbo' } = req.body;

        // 验证输入
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                error: '无效的提示词'
            });
        }

        // 设置SSE响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 这里实现流式响应
        // 示例：逐字返回
        if (process.env.OPENAI_API_KEY) {
            await streamOpenAI(prompt, { temperature, max_tokens, model }, res);
        } else {
            // 模拟流式响应
            await streamMockResponse(prompt, res);
        }

        res.end();

    } catch (error) {
        console.error('流式生成错误:', error);
        if (!res.headersSent) {
            res.status(500).json({
                error: '流式生成失败',
                message: error.message
            });
        }
    }
});

/**
 * 验证AI服务配置
 * GET /api/ai/status
 */
router.get('/status', (req, res) => {
    const status = {
        configured: !!(process.env.OPENAI_API_KEY || process.env.CUSTOM_AI_ENDPOINT),
        provider: process.env.OPENAI_API_KEY ? 'openai' : process.env.CUSTOM_AI_ENDPOINT ? 'custom' : 'mock',
        available: true
    };

    res.json(status);
});

// ==================== AI服务调用函数 ====================

/**
 * 调用OpenAI API
 */
async function callOpenAI(prompt, options) {
    const fetch = require('node-fetch');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: options.model || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: '你是一个专业的教学内容设计专家，擅长创建对话式学习内容。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: options.temperature,
            max_tokens: options.max_tokens
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API调用失败');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * 调用自定义AI服务
 */
async function callCustomAI(prompt, options) {
    const fetch = require('node-fetch');

    const response = await fetch(process.env.CUSTOM_AI_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CUSTOM_AI_API_KEY || ''}`
        },
        body: JSON.stringify({
            prompt: prompt,
            temperature: options.temperature,
            max_tokens: options.max_tokens
        })
    });

    if (!response.ok) {
        throw new Error('自定义AI服务调用失败');
    }

    const data = await response.json();
    return data.content || data.text || data.response;
}

/**
 * 流式调用OpenAI
 */
async function streamOpenAI(prompt, options, res) {
    const fetch = require('node-fetch');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: options.model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            temperature: options.temperature,
            max_tokens: options.max_tokens,
            stream: true
        })
    });

    if (!response.ok) {
        throw new Error('OpenAI流式调用失败');
    }

    // 转发流式数据
    for await (const chunk of response.body) {
        res.write(chunk);
    }
}

/**
 * 生成模拟响应（用于开发测试）
 */
function generateMockResponse(prompt) {
    // 尝试从prompt中提取JSON结构的提示
    const topicMatch = prompt.match(/学习主题[：:]\s*(.+)/);
    const topic = topicMatch ? topicMatch[1].trim() : '示例主题';

    // 生成符合conversation格式的JSON
    const mockResponse = {
        "title": topic,
        "description": `这是关于${topic}的对话式学习内容`,
        "conversations": [
            {
                "id": 1,
                "type": "text",
                "content": `你好！今天我们来学习${topic}。`,
                "points": 2
            },
            {
                "id": 2,
                "type": "text",
                "content": `${topic}是一个重要的概念，让我们一步步了解。`,
                "points": 2
            },
            {
                "id": 3,
                "type": "image",
                "content": `让我们看看${topic}的示意图：`,
                "imageUrl": `/assets/images/${topic.replace(/\s+/g, '-').toLowerCase()}.png`,
                "imageAlt": `${topic}示意图`,
                "points": 3
            },
            {
                "id": 4,
                "type": "test",
                "content": "来做个小测试！",
                "question": `关于${topic}，以下哪个说法是正确的？`,
                "options": [
                    "选项A（示例）",
                    "选项B（示例）",
                    "选项C（正确答案）",
                    "选项D（示例）"
                ],
                "correctAnswer": 2,
                "explanation": `这是关于${topic}的解释。正确答案是选项C。`,
                "points": 5
            },
            {
                "id": 5,
                "type": "text",
                "content": `很好！你已经掌握了${topic}的基本概念。`,
                "points": 2
            }
        ]
    };

    return JSON.stringify(mockResponse, null, 2);
}

/**
 * 模拟流式响应
 */
async function streamMockResponse(prompt, res) {
    const mockContent = generateMockResponse(prompt);
    const words = mockContent.split('');

    for (let i = 0; i < words.length; i++) {
        res.write(`data: ${JSON.stringify({ content: words[i] })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    res.write('data: [DONE]\n\n');
}

module.exports = router;

