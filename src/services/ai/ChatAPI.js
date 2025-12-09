/**
 * AI Chat API Client
 * 与后端 AI 服务通信的客户端 - 支持 SSE 流式响应
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * AI Provider 配置
 */
export const AI_PROVIDERS = {
    DEEPSEEK: { id: 'deepseek', name: 'DeepSeek', defaultModel: 'deepseek-chat' },
    GOOGLE: { id: 'google', name: 'Google Gemini', defaultModel: 'gemini-1.5-flash' },
    OPENAI: { id: 'openai', name: 'OpenAI', defaultModel: 'gpt-4o-mini' }
};

/**
 * 获取可用的 AI 模型列表
 */
export async function getProviders() {
    try {
        const response = await fetch(`${API_BASE}/api/providers`);
        if (!response.ok) throw new Error('Failed to fetch providers');
        return await response.json();
    } catch (error) {
        console.error('[AI API] Error fetching providers:', error);
        return {
            providers: [
                { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
                { id: 'google', name: 'Google Gemini', models: ['gemini-1.5-flash', 'gemini-1.5-pro'] },
                { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o'] }
            ]
        };
    }
}

/**
 * 发送聊天消息并获取流式响应
 * @param {Object} options
 * @param {Array} options.messages - 消息历史
 * @param {string} options.xml - 当前图表 XML
 * @param {string} options.provider - AI 提供商
 * @param {string} options.model - 模型名称
 * @param {string} options.apiKey - API Key
 * @param {Function} options.onText - 文本回调 (增量)
 * @param {Function} options.onToolCall - 工具调用回调
 * @param {Function} options.onError - 错误回调
 * @param {Function} options.onDone - 完成回调
 */
export async function streamChat({
    messages,
    xml,
    provider = 'deepseek',
    model,
    apiKey,
    onText,
    onToolCall,
    onError,
    onDone
}) {
    let toolCallSent = false; // 防止重复发送工具调用

    try {
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages,
                xml,
                provider,
                model,
                apiKey
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        // 检查响应类型
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('text/event-stream')) {
            // 处理 SSE 流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

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
                            onDone?.();
                            return;
                        }
                        try {
                            const parsed = JSON.parse(data);

                            if (parsed.type === 'text' && onText) {
                                onText(parsed.content);
                            } else if (parsed.type === 'tool_call' && onToolCall && !toolCallSent) {
                                toolCallSent = true; // 只发送一次
                                onToolCall(parsed.tool, parsed.args);
                            } else if (parsed.type === 'error' && onError) {
                                onError(new Error(parsed.error));
                            }
                        } catch (e) {
                            console.warn('[AI API] Failed to parse SSE data:', data);
                        }
                    }
                }
            }
        } else {
            // 处理普通 JSON 响应
            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            }

            if (result.text && onText) {
                onText(result.text);
            }

            if (result.type === 'tool_call' && onToolCall) {
                onToolCall(result.tool, result.args);
            }
        }

        onDone?.();
    } catch (error) {
        console.error('[AI API] Error:', error);
        onError?.(error);
    }
}

/**
 * 非流式聊天请求（简化版）
 */
export async function chat({ messages, xml, provider = 'deepseek', model, apiKey }) {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages,
            xml,
            provider,
            model,
            apiKey
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    // 收集 SSE 响应
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/event-stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let text = '';
        let toolCalls = [];
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'text') {
                            text += parsed.content;
                        } else if (parsed.type === 'tool_call') {
                            toolCalls.push({ tool: parsed.tool, args: parsed.args });
                        }
                    } catch (e) { }
                }
            }
        }

        return { text, toolCalls };
    }

    return await response.json();
}

/**
 * 健康检查
 */
export async function healthCheck() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}

export default {
    AI_PROVIDERS,
    getProviders,
    streamChat,
    chat,
    healthCheck
};
