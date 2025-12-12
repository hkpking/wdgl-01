import { streamText } from 'ai';
import { getAIModel, validateApiKey } from '@/lib/ai-providers';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { prompt, provider = 'deepseek', model = 'deepseek-chat', apiKey } = await req.json();

        // Check if API key is provided in request or environment
        const hasEnvironmentKey = validateApiKey(provider);
        const effectiveApiKey = apiKey || (hasEnvironmentKey ? undefined : null);

        if (!effectiveApiKey && !hasEnvironmentKey) {
            return Response.json(
                { error: 'API Configuration Missing: Please provide an API key or configure server environment.' },
                { status: 401 }
            );
        }

        const aiModel = getAIModel(provider, model, effectiveApiKey);

        const result = streamText({
            model: aiModel,
            prompt: prompt,
            temperature: 0.2, // Lower temperature for code completion
            // maxTokens: 500,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error in completion route:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
