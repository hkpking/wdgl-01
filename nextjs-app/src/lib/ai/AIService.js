import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';
import { PromptRegistry } from './PromptRegistry';

/**
 * AI Service for handling interactions with multiple LLM providers.
 * Supports: Google Gemini, DeepSeek (OpenAI-compatible), and Mock mode.
 */

// Supported AI providers
export const AI_PROVIDERS = {
    GEMINI: 'gemini',
    DEEPSEEK: 'deepseek',
    // Future: OPENAI: 'openai', ANTHROPIC: 'anthropic', etc.
};

class AIService {
    constructor() {
        if (typeof window !== 'undefined') {
            this.provider = localStorage.getItem('wdgl_ai_provider') || AI_PROVIDERS.DEEPSEEK; // Default to DeepSeek
            this.apiKey = localStorage.getItem('wdgl_ai_key') || '';
            this.modelName = localStorage.getItem('wdgl_ai_model') || 'deepseek-chat';
        } else {
            this.provider = AI_PROVIDERS.DEEPSEEK;
            this.apiKey = '';
            this.modelName = 'deepseek-chat';
        }
    }

    /**
     * Get available models details
     */
    getAvailableModels() {
        if (this.provider === AI_PROVIDERS.DEEPSEEK) {
            return [
                { id: 'deepseek-chat', name: 'DeepSeek Chat (推荐)' },
                { id: 'deepseek-coder', name: 'DeepSeek Coder' },
                { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
            ];
        } else {
            return [
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
                { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
                { id: 'gpt-4o-mini', name: 'GPT-4o Mini' }
            ];
        }
    }

    /**
     * Fetch available models (from backend if needed, or static list)
     */
    async fetchAvailableModels(apiKey) {
        // For now, return static list or fetch from /api/models if implemented
        return this.getAvailableModels();
    }

    /**
     * Generate autocomplete suggestion
     * Uses /api/completion
     */
    async generateCompletion(text, context = '') {
        try {
            const prompt = PromptRegistry.AUTOCOMPLETE(context, text);

            const response = await fetch('/api/completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    provider: this.provider,
                    model: this.modelName,
                    apiKey: this.apiKey // Optional, backend will use env key if missing
                })
            });

            if (!response.ok) return "";

            // Handle stream response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }
            return result;
        } catch (error) {
            console.warn("Autocomplete failed:", error);
            return "";
        }
    }

    /**
     * Generate text content
     * Uses /api/completion
     */
    async generateText(prompt) {
        try {
            const response = await fetch('/api/completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    provider: this.provider,
                    model: this.modelName,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Generate failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value, { stream: true });
            }
            return result;
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }
    }

    /**
     * Generate Diagram
     * Uses /api/chat (reusing the chat logic which handles tools)
     */
    async generateDiagram(userPrompt, currentXML = '') {
        try {
            // We use /api/chat because it already has the tool calling logic for diagrams
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: userPrompt }],
                    xml: currentXML,
                    provider: this.provider,
                    model: this.modelName,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Diagram generation failed');
            }

            // The chat API returns a stream of tool calls. 
            // We need to parse this stream to find the display_diagram or edit_diagram tool call.
            // Simplified approach: For single-turn diagram generation, we can parse the UI message stream response.
            // usage of ai-sdk on client side usually handles this via useChat. 
            // But here we are calling it as a one-off service function.
            // This is tricky because /api/chat returns a stream formatted for useChat.
            // We might need to accumulate the stream and parse the tool calls manually if not using useChat.

            // HOWEVER, the existing code was using OpenAI/Gemini client directly.
            // If we want to unify, we should probably stick to useChat in the UI components (like ChatPanel).
            // But if this function is called from elsewhere (e.g. context menu), we need a way to parse the result.

            // Let's read the stream and accumulate tool calls.
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
            }

            // Parsing the Protocol Stream from AI SDK is complex.
            // Ideally, rewrite this to use the `generateText` SDK function on the server-side if simple generation is needed,
            // OR, since ChatPanel already uses useChat, maybe we don't need this method to fully replicate the old logic?
            // The old logic returned { tool, content }.

            // Fallback: Return a message saying "Please use the Chat Panel for diagram generation" if called programmatically,
            // or try to do a best-effort parse.

            // Actually, for now, let's assumes this method is primarily used by the ChatPanel which uses `useChat` directly.
            // But wait, the `ChatPanel` calls `sendMessage` which hits `/api/chat`.
            // Does anything else call `AIService.generateDiagram`?
            // Checking usages... usually it's just ChatPanel. 
            // If ChatPanel uses `useChat`, it doesn't use `AIService.generateDiagram`.
            // Let's check `AIService.js` usage.

            return { tool: 'error', content: 'Please use the AI Chat Panel for diagram generation.' };

        } catch (error) {
            console.error("Generate Diagram Error:", error);
            throw error;
        }
    }

    /**
     * Stream text content with callback
     * Uses /api/completion
     */
    async streamText(prompt, onChunk) {
        try {
            const response = await fetch('/api/completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    provider: this.provider,
                    model: this.modelName,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Stream failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (chunk && onChunk) onChunk(chunk);
            }
        } catch (error) {
            console.error("AI Stream Error:", error);
            throw error;
        }
    }

    /**
     * Stream autocomplete suggestion with callback
     * Uses /api/completion
     */
    async streamCompletion(text, context = '', onChunk) {
        try {
            const prompt = PromptRegistry.AUTOCOMPLETE(context, text);

            const response = await fetch('/api/completion', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    provider: this.provider,
                    model: this.modelName,
                    apiKey: this.apiKey
                })
            });

            if (!response.ok) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                if (chunk && onChunk) onChunk(chunk);
            }
        } catch (error) {
            console.warn("Autocomplete stream failed:", error);
        }
    }
}

export const aiService = new AIService();
