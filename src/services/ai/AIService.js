import { GoogleGenerativeAI } from "@google/generative-ai";
import { PromptRegistry } from './PromptRegistry';

/**
 * AI Service for handling interactions with LLMs (Gemini).
 * Supports both real API calls and a Mock mode for development without keys.
 */
class AIService {
    constructor() {
        this.apiKey = localStorage.getItem('wdgl_ai_key') || '';
        this.modelName = localStorage.getItem('wdgl_ai_model') || 'gemini-1.5-flash';
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
    initClient(apiKey, modelName = 'gemini-1.5-flash') {
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
                { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Default)' },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
                { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Preview)' }
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


            const prompt = PromptRegistry.AUTOCOMPLETE(context, text);

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
     * Generate autocomplete suggestion (Streaming)
     * @param {string} text Current text
     * @param {string} context Surrounding context
     * @param {function} onChunk Callback for each chunk
     * @returns {Promise<void>}
     */
    async streamCompletion(text, context = '', onChunk) {
        if (this.isMock) {
            return this._mockStream("Autocomplete: " + text, onChunk);
        }

        try {
            const completionModel = this.model;

            const prompt = PromptRegistry.AUTOCOMPLETE_STREAM(context, text);

            const result = await completionModel.generateContentStream(prompt);

            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                onChunk(chunkText);
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

        try {
            // Define tools for Gemini
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

            // Get a model instance with tools
            const model = this.genAI.getGenerativeModel({
                model: this.modelName,
                tools: tools
            });



            const systemPrompt = PromptRegistry.DRAWIO_SYSTEM(currentXML);

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to generate or edit diagrams." }]
                    }
                ]
            });

            const result = await chat.sendMessage(userPrompt);
            const response = await result.response;
            const functionCalls = response.functionCalls();

            if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls[0];
                return {
                    tool: call.name,
                    content: call.args
                };
            } else {
                // If no function call, check if it returned XML in text
                const text = response.text();

                // Fallback: Try to extract XML from text if it looks like a diagram
                const xmlMatch = text.match(/```xml\s*([\s\S]*?)\s*```/) || text.match(/<mxfile[\s\S]*?<\/mxfile>/) || text.match(/<root>[\s\S]*?<\/root>/);

                if (xmlMatch) {
                    let xmlContent = xmlMatch[1] || xmlMatch[0];
                    // Clean up potential markdown code block markers if regex matched the whole block without capturing group
                    xmlContent = xmlContent.replace(/^```xml\s*/, '').replace(/\s*```$/, '');

                    console.log("Fallback: Detected XML in text response, converting to tool call.");

                    // Determine if it's a full diagram or partial edit based on content
                    if (xmlContent.includes('<mxfile') || xmlContent.includes('<root>')) {
                        return {
                            tool: 'display_diagram',
                            content: { xml: xmlContent }
                        };
                    }
                }

                return {
                    tool: 'message',
                    content: text
                };
            }

        } catch (error) {
            console.error("Generate Diagram Error:", error);
            throw error;
        }
    }

}

export const aiService = new AIService();
