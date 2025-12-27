import { NextResponse } from 'next/server';

// 默认模型列表（当 API 调用失败时使用）
const DEFAULT_MODELS: Record<string, { id: string; name: string }[]> = {
    deepseek: [
        { id: 'deepseek-chat', name: 'DeepSeek-V3.2 (非思考模式)' },
        { id: 'deepseek-reasoner', name: 'DeepSeek-V3.2 (思考模式)' },
    ],
    google: [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (最新)' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ],
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o (最新)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'o1-mini', name: 'O1 Mini' },
    ],
};

// 从 Gemini API 动态获取模型列表
async function fetchGeminiModels(apiKey: string) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        return data.models
            .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
            .map((m: any) => ({
                id: m.name.replace('models/', ''),
                name: m.displayName || m.name,
            }));
    } catch (error) {
        console.error('Error fetching Gemini models:', error);
        return DEFAULT_MODELS.google;
    }
}

// 从 OpenAI API 动态获取模型列表
async function fetchOpenAIModels(apiKey: string) {
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!response.ok) throw new Error('Failed to fetch models');
        const data = await response.json();
        return data.data
            .filter((m: any) => m.id.includes('gpt') || m.id.includes('o1'))
            .map((m: any) => ({
                id: m.id,
                name: m.id,
            }))
            .slice(0, 10); // 只取前10个
    } catch (error) {
        console.error('Error fetching OpenAI models:', error);
        return DEFAULT_MODELS.openai;
    }
}

export async function POST(req: Request) {
    try {
        const { provider, apiKey } = await req.json();

        let models = DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] || [];

        // 如果提供了 API Key，尝试动态获取模型列表
        if (apiKey) {
            if (provider === 'google') {
                models = await fetchGeminiModels(apiKey);
            } else if (provider === 'openai') {
                models = await fetchOpenAIModels(apiKey);
            }
            // DeepSeek API 不支持列出模型，使用默认列表
        }

        return NextResponse.json({ models });
    } catch (error) {
        console.error('Error in models API:', error);
        return NextResponse.json(
            { error: 'Internal server error', models: [] },
            { status: 500 }
        );
    }
}

// GET 请求返回默认模型列表
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const provider = searchParams.get('provider') || 'deepseek';

    const models = DEFAULT_MODELS[provider as keyof typeof DEFAULT_MODELS] || [];
    return NextResponse.json({ models });
}
