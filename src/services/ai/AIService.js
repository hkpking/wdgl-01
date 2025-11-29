import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * AI Service for handling interactions with LLMs (Gemini).
 * Supports both real API calls and a Mock mode for development without keys.
 */
class AIService {
    constructor() {
        this.apiKey = localStorage.getItem('wdgl_ai_key') || '';
        this.modelName = localStorage.getItem('wdgl_ai_model') || 'gemini-pro';
        this.genAI = null;
        this.model = null;
        this.isMock = !this.apiKey;

        if (this.apiKey) {
            this.initClient(this.apiKey, this.modelName);
        }
    }

    /**
     * Initialize the Gemini client
     * @param {string} apiKey 
     */
    initClient(apiKey, modelName = 'gemini-pro') {
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.isMock = false;
        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: modelName });
            localStorage.setItem('wdgl_ai_key', apiKey);
            localStorage.setItem('wdgl_ai_model', modelName);
        } catch (error) {
            console.error("Failed to initialize AI client:", error);
            this.isMock = true;
        }
    }

    /**
     * Fetch available models from Google API
     * @param {string} apiKey 
     * @returns {Promise<Array>} List of models
     */
    async fetchAvailableModels(apiKey) {
        if (!apiKey) return [];
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            if (!response.ok) throw new Error('Failed to fetch models');
            const data = await response.json();
            return data.models
                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                .map(m => ({
                    id: m.name.replace('models/', ''),
                    name: m.displayName || m.name
                }));
        } catch (error) {
            console.error("Error fetching models:", error);
            return [
                { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Preview)' },
                { id: 'gemini-pro', name: 'Gemini Pro (Default)' },
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }
            ];
        }
    }

    /**
     * Generate autocomplete suggestion
     * @param {string} text Current text
     * @param {string} context Surrounding context
     * @returns {Promise<string>} Suggested completion
     */
    async generateCompletion(text, context = '') {
        if (this.isMock) {
            return new Promise(resolve => setTimeout(() => resolve(" [Mock Autocomplete]"), 500));
        }

        try {
            // Use the currently selected model (user preference)
            const completionModel = this.model;

            const prompt = `
You are an intelligent writing assistant.
Complete the following text naturally.
Output ONLY the completion text. Do not repeat the input.
Keep it short (max 1 sentence).
If the input is complete, return empty string.

Context: ${context}
Input: "${text}"
Completion:`;

            const result = await completionModel.generateContent(prompt);
            const response = await result.response;
            const completion = response.text();

            // Clean up: remove leading spaces if input ends with space, etc.
            // But usually we want to preserve natural spacing.
            return completion;
        } catch (error) {
            console.warn("Autocomplete failed:", error);
            return "";
        }
    }

    /**
     * Switch to Mock mode explicitly or clear API key
     */
    enableMockMode() {
        this.isMock = true;
        this.apiKey = '';
        this.genAI = null;
        this.model = null;
        localStorage.removeItem('wdgl_ai_key');
    }

    /**
     * Generate text content
     * @param {string} prompt 
     * @returns {Promise<string>}
     */
    async generateText(prompt) {
        if (this.isMock) {
            return this._mockGenerate(prompt);
        }

        try {
            if (!this.model) throw new Error("AI Model not initialized");
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Generation Error:", error);
            // Fallback to mock if error occurs (optional, maybe better to throw)
            throw error;
        }
    }

    /**
     * Stream text content
     * @param {string} prompt 
     * @param {function} onChunk - Callback for each chunk
     * @returns {Promise<void>}
     */
    async streamText(prompt, onChunk) {
        if (this.isMock) {
            return this._mockStream(prompt, onChunk);
        }

        try {
            if (!this.model) throw new Error("AI Model not initialized");
            const result = await this.model.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                onChunk(chunkText);
            }
        } catch (error) {
            console.error("AI Stream Error:", error);
            throw error;
        }
    }

    // --- Mock Implementation ---

    async _mockGenerate(prompt) {
        console.log("[Mock AI] Generating for:", prompt);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
        return `[MOCK RESPONSE]\nThis is a simulated response for the prompt:\n"${prompt.substring(0, 50)}..."\n\nIn a real scenario, Gemini would provide intelligent content here.`;
    }

    async _mockStream(prompt, onChunk) {
        console.log("[Mock AI] Streaming for:", prompt);
        const mockResponse = `[MOCK STREAM]\nThis is a simulated streaming response.\nIt mimics the behavior of an LLM generating text token by token.\n\nPrompt received: "${prompt.substring(0, 30)}..."`;

        const chunks = mockResponse.split(/(?=[ \n])/); // Split by words/spaces

        for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate token delay
            onChunk(chunk);
        }
    }
}

export const aiService = new AIService();
