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
        this.provider = localStorage.getItem('wdgl_ai_provider') || AI_PROVIDERS.GEMINI;
        this.apiKey = localStorage.getItem('wdgl_ai_key') || '';
        this.modelName = localStorage.getItem('wdgl_ai_model') || this._getDefaultModel();

        // Provider-specific clients
        this.genAI = null; // Google Gemini
        this.openaiClient = null; // DeepSeek (OpenAI-compatible)
        this.model = null;

        this.isMock = !this.apiKey;

        if (this.apiKey) {
            this.initClient(this.apiKey, this.modelName, this.provider);
        }
    }

    _getDefaultModel() {
        switch (this.provider) {
            case AI_PROVIDERS.DEEPSEEK:
                return 'deepseek-chat';
            case AI_PROVIDERS.GEMINI:
            default:
                return 'gemini-1.5-flash';
        }
    }

    /**
     * Initialize the AI client based on provider
     * @param {string} apiKey 
     * @param {string} modelName 
     * @param {string} provider 
     */
    initClient(apiKey, modelName, provider = AI_PROVIDERS.GEMINI) {
        this.apiKey = apiKey;
        this.modelName = modelName;
        this.provider = provider;
        this.isMock = false;

        try {
            if (provider === AI_PROVIDERS.DEEPSEEK) {
                // DeepSeek uses OpenAI-compatible API
                this.openaiClient = new OpenAI({
                    baseURL: 'https://api.deepseek.com/v1',
                    apiKey: apiKey,
                    dangerouslyAllowBrowser: true // Required for browser usage
                });
                this.genAI = null;
                this.model = null;
            } else {
                // Default: Google Gemini
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({ model: modelName });
                this.openaiClient = null;
            }

            localStorage.setItem('wdgl_ai_key', apiKey);
            localStorage.setItem('wdgl_ai_model', modelName);
            localStorage.setItem('wdgl_ai_provider', provider);
        } catch (error) {
            console.error("Failed to initialize AI client:", error);
            this.isMock = true;
        }
    }

    /**
     * Get available models for the current provider
     * @returns {Array} List of models
     */
    getAvailableModels() {
        if (this.provider === AI_PROVIDERS.DEEPSEEK) {
            return [
                { id: 'deepseek-chat', name: 'DeepSeek Chat (推荐)' },
                { id: 'deepseek-coder', name: 'DeepSeek Coder' },
                { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
            ];
        } else {
            // Gemini models
            return [
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (默认)' },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
                { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (预览)' }
            ];
        }
    }

    /**
     * Fetch available models from API (async version)
     * @param {string} apiKey 
     * @returns {Promise<Array>} List of models
     */
    async fetchAvailableModels(apiKey) {
        if (!apiKey) return this.getAvailableModels();

        if (this.provider === AI_PROVIDERS.GEMINI) {
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
            }
        }

        return this.getAvailableModels();
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
            const prompt = PromptRegistry.AUTOCOMPLETE(context, text);

            if (this.provider === AI_PROVIDERS.DEEPSEEK) {
                const response = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 100
                });
                return response.choices[0]?.message?.content || '';
            } else {
                // Gemini
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            }
        } catch (error) {
            console.warn("Autocomplete failed:", error);
            return "";
        }
    }

    /**
     * Generate autocomplete suggestion (Streaming)
     */
    async streamCompletion(text, context = '', onChunk) {
        if (this.isMock) {
            return this._mockStream("Autocomplete: " + text, onChunk);
        }

        try {
            const prompt = PromptRegistry.AUTOCOMPLETE_STREAM(context, text);

            if (this.provider === AI_PROVIDERS.DEEPSEEK) {
                const stream = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages: [{ role: 'user', content: prompt }],
                    stream: true
                });
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) onChunk(content);
                }
            } else {
                // Gemini
                const result = await this.model.generateContentStream(prompt);
                for await (const chunk of result.stream) {
                    onChunk(chunk.text());
                }
            }
        } catch (error) {
            console.warn("Autocomplete stream failed:", error);
        }
    }

    /**
     * Switch to Mock mode explicitly or clear API key
     */
    enableMockMode() {
        this.isMock = true;
        this.apiKey = '';
        this.genAI = null;
        this.openaiClient = null;
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
            if (this.provider === AI_PROVIDERS.DEEPSEEK) {
                const response = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages: [{ role: 'user', content: prompt }]
                });
                return response.choices[0]?.message?.content || '';
            } else {
                if (!this.model) throw new Error("AI Model not initialized");
                const result = await this.model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw error;
        }
    }

    /**
     * Stream text content
     */
    async streamText(prompt, onChunk) {
        if (this.isMock) {
            return this._mockStream(prompt, onChunk);
        }

        try {
            if (this.provider === AI_PROVIDERS.DEEPSEEK) {
                const stream = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages: [{ role: 'user', content: prompt }],
                    stream: true
                });
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    if (content) onChunk(content);
                }
            } else {
                if (!this.model) throw new Error("AI Model not initialized");
                const result = await this.model.generateContentStream(prompt);
                for await (const chunk of result.stream) {
                    onChunk(chunk.text());
                }
            }
        } catch (error) {
            console.error("AI Stream Error:", error);
            throw error;
        }
    }

    // --- Mock Implementation ---

    async _mockGenerate(prompt) {
        console.log("[Mock AI] Generating for:", prompt);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `[MOCK RESPONSE]\nThis is a simulated response for the prompt:\n"${prompt.substring(0, 50)}..."\n\nIn a real scenario, the AI would provide intelligent content here.`;
    }

    async _mockStream(prompt, onChunk) {
        console.log("[Mock AI] Streaming for:", prompt);
        const mockResponse = `[MOCK STREAM]\nThis is a simulated streaming response.\nPrompt: "${prompt.substring(0, 30)}..."`;

        const chunks = mockResponse.split(/(?=[ \n])/);
        for (const chunk of chunks) {
            await new Promise(resolve => setTimeout(resolve, 100));
            onChunk(chunk);
        }
    }

    /**
     * Generate or Edit a Draw.io diagram
     * @param {string} userPrompt - The user's request
     * @param {string} currentXML - The current XML of the diagram (empty if new)
     * @returns {Promise<{tool: string, content: any}>} - The tool to call and its content
     */
    async generateDiagram(userPrompt, currentXML = '') {
        if (this.isMock) {
            console.log("[Mock AI] Generating diagram for:", userPrompt);
            return {
                tool: 'display_diagram',
                content: {
                    xml: '<root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="2" value="Mock Diagram" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1"><mxGeometry x="120" y="120" width="120" height="60" as="geometry"/></mxCell></root>'
                }
            };
        }

        const systemPrompt = PromptRegistry.DRAWIO_SYSTEM(currentXML);

        try {
            if (this.provider === AI_PROVIDERS.DEEPSEEK) {
                // DeepSeek: Use function calling with OpenAI format
                const tools = [
                    {
                        type: "function",
                        function: {
                            name: "display_diagram",
                            description: "Display a NEW diagram on draw.io. Use this when creating a diagram from scratch or when major structural changes are needed.",
                            parameters: {
                                type: "object",
                                properties: {
                                    xml: {
                                        type: "string",
                                        description: "XML string to be displayed on draw.io. Must include <root> and nodes."
                                    }
                                },
                                required: ["xml"]
                            }
                        }
                    },
                    {
                        type: "function",
                        function: {
                            name: "edit_diagram",
                            description: "Edit specific parts of the EXISTING diagram. Use this when making small targeted changes.",
                            parameters: {
                                type: "object",
                                properties: {
                                    edits: {
                                        type: "array",
                                        description: "Array of search/replace pairs",
                                        items: {
                                            type: "object",
                                            properties: {
                                                search: { type: "string", description: "Exact lines to search for" },
                                                replace: { type: "string", description: "Replacement lines" }
                                            },
                                            required: ["search", "replace"]
                                        }
                                    }
                                },
                                required: ["edits"]
                            }
                        }
                    }
                ];

                const response = await this.openaiClient.chat.completions.create({
                    model: this.modelName,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    tools: tools,
                    tool_choice: 'auto'
                });

                const message = response.choices[0]?.message;

                if (message?.tool_calls && message.tool_calls.length > 0) {
                    const toolCall = message.tool_calls[0];
                    const args = JSON.parse(toolCall.function.arguments);
                    return {
                        tool: toolCall.function.name,
                        content: args
                    };
                } else if (message?.content) {
                    // Fallback: try to extract XML from text
                    const text = message.content;
                    const xmlMatch = text.match(/```xml\s*([\s\S]*?)\s*```/) || text.match(/<mxfile[\s\S]*?<\/mxfile>/) || text.match(/<root>[\s\S]*?<\/root>/);

                    if (xmlMatch) {
                        let xmlContent = xmlMatch[1] || xmlMatch[0];
                        xmlContent = xmlContent.replace(/^```xml\s*/, '').replace(/\s*```$/, '');
                        return {
                            tool: 'display_diagram',
                            content: { xml: xmlContent }
                        };
                    }

                    return { tool: 'message', content: text };
                }

                return { tool: 'message', content: '无法生成图表，请重试。' };

            } else {
                // Gemini: Use Gemini's function calling
                const tools = [
                    {
                        functionDeclarations: [
                            {
                                name: "display_diagram",
                                description: "Display a NEW diagram on draw.io. Use this when creating a diagram from scratch or when major structural changes are needed.",
                                parameters: {
                                    type: "OBJECT",
                                    properties: {
                                        xml: {
                                            type: "STRING",
                                            description: "XML string to be displayed on draw.io. Must include <root> and nodes."
                                        }
                                    },
                                    required: ["xml"]
                                }
                            },
                            {
                                name: "edit_diagram",
                                description: "Edit specific parts of the EXISTING diagram. Use this when making small targeted changes.",
                                parameters: {
                                    type: "OBJECT",
                                    properties: {
                                        edits: {
                                            type: "ARRAY",
                                            description: "Array of search/replace pairs",
                                            items: {
                                                type: "OBJECT",
                                                properties: {
                                                    search: { type: "STRING", description: "Exact lines to search for" },
                                                    replace: { type: "STRING", description: "Replacement lines" }
                                                },
                                                required: ["search", "replace"]
                                            }
                                        }
                                    },
                                    required: ["edits"]
                                }
                            }
                        ]
                    }
                ];

                const model = this.genAI.getGenerativeModel({
                    model: this.modelName,
                    tools: tools
                });

                const chat = model.startChat({
                    history: [
                        { role: "user", parts: [{ text: systemPrompt }] },
                        { role: "model", parts: [{ text: "Understood. I am ready to generate or edit diagrams." }] }
                    ]
                });

                const result = await chat.sendMessage(userPrompt);
                const response = await result.response;
                const functionCalls = response.functionCalls();

                if (functionCalls && functionCalls.length > 0) {
                    const call = functionCalls[0];
                    return { tool: call.name, content: call.args };
                } else {
                    const text = response.text();
                    const xmlMatch = text.match(/```xml\s*([\s\S]*?)\s*```/) || text.match(/<mxfile[\s\S]*?<\/mxfile>/) || text.match(/<root>[\s\S]*?<\/root>/);

                    if (xmlMatch) {
                        let xmlContent = xmlMatch[1] || xmlMatch[0];
                        xmlContent = xmlContent.replace(/^```xml\s*/, '').replace(/\s*```$/, '');

                        if (xmlContent.includes('<mxfile') || xmlContent.includes('<root>')) {
                            return { tool: 'display_diagram', content: { xml: xmlContent } };
                        }
                    }

                    return { tool: 'message', content: text };
                }
            }

        } catch (error) {
            console.error("Generate Diagram Error:", error);
            throw error;
        }
    }
}

export const aiService = new AIService();
