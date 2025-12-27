/**
 * @file ai-service.js
 * @description AI服务接口 - 统一的AI调用服务
 * @version 1.0.0
 */

/**
 * AI服务类
 */
export class AIService {
    constructor(config = {}) {
        this.config = {
            // 默认使用OpenAI兼容接口
            apiEndpoint: config.apiEndpoint || '/api/ai/chat',
            apiKey: config.apiKey || '',
            model: config.model || 'gpt-3.5-turbo',
            timeout: config.timeout || 30000,
            maxRetries: config.maxRetries || 2,
            ...config
        };

    }

    /**
     * 生成内容 - 通用接口
     * @param {string} prompt - 提示词
     * @param {Object} options - 生成选项
     * @returns {Promise<string>} - 生成的内容
     */
    async generateContent(prompt, options = {}) {
        const params = {
            temperature: options.temperature || 0.7,
            maxTokens: options.maxTokens || 2000,
            ...options
        };

        let lastError = null;
        let retries = 0;

        while (retries <= this.config.maxRetries) {
            try {
                
                const result = await this.makeRequest(prompt, params);
                
                return result;

            } catch (error) {
                lastError = error;
                retries++;
                
                if (retries <= this.config.maxRetries) {
                    console.warn(`⚠️ AI请求失败，${2 ** retries}秒后重试...`, error.message);
                    await this.sleep(2 ** retries * 1000); // 指数退避
                }
            }
        }

        // 所有重试都失败
        console.error('❌ AI生成失败，已达最大重试次数');
        throw lastError;
    }

    /**
     * 发送AI请求
     * @private
     */
    async makeRequest(prompt, params) {
        // 方案1: 使用后端API（推荐）
        if (this.config.useBackend !== false) {
            return await this.makeBackendRequest(prompt, params);
        }
        
        // 方案2: 直接调用AI服务（需要处理CORS和API密钥安全问题）
        return await this.makeDirectRequest(prompt, params);
    }

    /**
     * 通过后端API调用
     * @private
     */
    async makeBackendRequest(prompt, params) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey || window.AppState?.user?.token || ''}`
                },
                body: JSON.stringify({
                    prompt: prompt,
                    temperature: params.temperature,
                    max_tokens: params.maxTokens,
                    model: this.config.model
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // 适配不同的响应格式
            if (data.content) {
                return data.content;
            } else if (data.choices && data.choices[0]?.message?.content) {
                return data.choices[0].message.content;
            } else if (data.text) {
                return data.text;
            } else {
                throw new Error('无效的响应格式');
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请稍后重试');
            }
            throw error;
        }
    }

    /**
     * 直接调用AI服务API（OpenAI格式）
     * @private
     */
    async makeDirectRequest(prompt, params) {
        if (!this.config.apiKey) {
            throw new Error('未配置API密钥');
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiKey}`
                },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: params.temperature,
                    max_tokens: params.maxTokens
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('请求超时，请稍后重试');
            }
            throw error;
        }
    }

    /**
     * 流式生成（用于实时显示生成过程）
     * @param {string} prompt - 提示词
     * @param {Function} onChunk - 每次接收到数据时的回调
     * @param {Object} options - 选项
     */
    async generateStream(prompt, onChunk, options = {}) {
        if (!this.config.apiKey) {
            throw new Error('未配置API密钥');
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2000,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            continue;
                        }

                        try {
                            const json = JSON.parse(data);
                            const content = json.choices[0]?.delta?.content;
                            
                            if (content) {
                                onChunk(content);
                            }
                        } catch (e) {
                            console.warn('解析流数据失败:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * 睡眠函数
     * @private
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 验证API配置
     */
    async validateConfig() {
        try {
            await this.generateContent('测试', { maxTokens: 10 });
            return { valid: true };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

/**
 * 创建全局AI服务实例
 */
export function createAIService(config) {
    return new AIService(config);
}

/**
 * 初始化全局AI服务
 */
export function initGlobalAIService(config = {}) {
    // 从环境变量或配置文件读取配置
    const serviceConfig = {
        apiEndpoint: window.AI_CONFIG?.apiEndpoint || config.apiEndpoint || '/api/ai/chat',
        apiKey: window.AI_CONFIG?.apiKey || config.apiKey || '',
        model: window.AI_CONFIG?.model || config.model || 'gpt-3.5-turbo',
        useBackend: window.AI_CONFIG?.useBackend !== false,
        ...config
    };

    // 创建全局实例
    window.AIService = new AIService(serviceConfig);
    
    return window.AIService;
}

// 默认导出
export default AIService;

