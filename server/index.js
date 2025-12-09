import express from 'express';
import cors from 'cors';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * Get AI model based on provider configuration
 */
function getAIModel(provider, modelId, apiKey) {
    console.log(`[AI Provider] Initializing ${provider} with model: ${modelId}`);

    switch (provider) {
        case 'deepseek':
            const deepseek = createDeepSeek({ apiKey });
            return deepseek(modelId || 'deepseek-chat');

        case 'google':
            const google = createGoogleGenerativeAI({ apiKey });
            return google(modelId || 'gemini-1.5-flash');

        case 'openai':
            const openai = createOpenAI({ apiKey });
            return openai(modelId || 'gpt-4o-mini');

        default:
            throw new Error(`Unknown AI provider: ${provider}`);
    }
}

/**
 * System prompt for Draw.io diagram generation (对标 aidiwo)
 * 使用 JSON 格式输出，便于解析
 */
const SYSTEM_PROMPT = `
You are an expert diagram creation assistant specializing in draw.io XML generation.
Your primary function is crafting clear, well-organized visual diagrams through precise XML specifications.

## Response Format
You MUST respond in this exact format:
1. First, output your thinking process (optional, short)
2. Then output the action marker: [ACTION:display_diagram] or [ACTION:edit_diagram] or [ACTION:message]
3. Then output the content:
   - For display_diagram: output the XML wrapped in <xml>...</xml>
   - For edit_diagram: output edits in format: [EDIT]search|||replace[/EDIT]
   - For message: just output the message

Example for creating a new diagram:
I'll create a simple flowchart for you.
[ACTION:display_diagram]
<xml>
<root>
  <mxCell id="0"/>
  <mxCell id="1" parent="0"/>
  <mxCell id="2" value="Start" style="ellipse;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1">
    <mxGeometry x="40" y="40" width="100" height="60" as="geometry"/>
  </mxCell>
</root>
</xml>

## Rules
- Use display_diagram for: Creating new diagrams, major restructuring, or when the current diagram XML is empty
- Use edit_diagram for: Small modifications only
- ALWAYS include [ACTION:...] marker before your content

## Layout constraints
- Position all elements with x coordinates between 0-800 and y coordinates between 0-600
- Maximum width for containers: 700 pixels
- Start positioning from x=40, y=40

## Shape Styles
- Process step: rounded=1;whiteSpace=wrap;fillColor=#dae8fc;strokeColor=#6c8ebf;
- Decision: rhombus;fillColor=#fff2cc;strokeColor=#d6b656;
- Start/End: ellipse;fillColor=#d5e8d4;strokeColor=#82b366;
- Arrow: edgeStyle=orthogonalEdgeStyle;rounded=1;
`;

/**
 * Parse streamed content to extract action and XML
 */
function parseStreamContent(content) {
    // Check for action markers
    const actionMatch = content.match(/\[ACTION:(display_diagram|edit_diagram|message)\]/);
    if (!actionMatch) {
        return { action: null, xml: null, text: content };
    }

    const action = actionMatch[1];
    const afterAction = content.split(actionMatch[0])[1] || '';

    if (action === 'display_diagram') {
        // Extract XML from <xml>...</xml> tags
        const xmlMatch = afterAction.match(/<xml>([\s\S]*?)<\/xml>/);
        if (xmlMatch) {
            // Clean up the XML - wrap in root if needed
            let xml = xmlMatch[1].trim();
            if (!xml.startsWith('<root>')) {
                xml = `<root>${xml}</root>`;
            }
            return { action, xml, text: content.split('[ACTION:')[0].trim() };
        }
        // If no closing tag yet, return partial
        const partialXml = afterAction.match(/<xml>([\s\S]*)/);
        if (partialXml) {
            return { action, xml: null, text: content.split('[ACTION:')[0].trim(), partial: true };
        }
    }

    if (action === 'edit_diagram') {
        const edits = [];
        const editRegex = /\[EDIT\]([\s\S]*?)\|\|\|([\s\S]*?)\[\/EDIT\]/g;
        let match;
        while ((match = editRegex.exec(afterAction)) !== null) {
            edits.push({ search: match[1].trim(), replace: match[2].trim() });
        }
        if (edits.length > 0) {
            return { action, edits, text: content.split('[ACTION:')[0].trim() };
        }
    }

    return { action: 'message', xml: null, text: afterAction.trim() };
}

/**
 * POST /api/chat - AI chat endpoint with streaming
 */
app.post('/api/chat', async (req, res) => {
    try {
        const { messages, xml, provider = 'deepseek', model: modelId, apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required' });
        }

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Get AI model
        const aiModel = getAIModel(provider, modelId, apiKey);

        // Get last message text
        const lastMessage = messages[messages.length - 1];
        const lastMessageText = lastMessage?.content || '';

        // Format user message with current diagram XML
        const formattedContent = `
Current diagram XML:
"""xml
${xml || '(Empty - create new diagram)'}
"""
User request:
"""
${lastMessageText}
"""`;

        // Build messages for AI
        const aiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.slice(0, -1).map(m => ({
                role: m.role,
                content: m.content
            })),
            { role: 'user', content: formattedContent }
        ];

        console.log(`[Chat] Processing streaming request from ${provider}`);

        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Stream the response
        const result = streamText({
            model: aiModel,
            messages: aiMessages,
            temperature: 0,
        });

        let fullContent = '';

        // Stream text chunks
        for await (const chunk of result.textStream) {
            fullContent += chunk;

            // Send text chunk
            res.write(`data: ${JSON.stringify({ type: 'text', content: chunk })}\n\n`);

            // Check if we have a complete XML after action marker
            const parsed = parseStreamContent(fullContent);
            if (parsed.action === 'display_diagram' && parsed.xml) {
                // Send tool call with XML
                res.write(`data: ${JSON.stringify({
                    type: 'tool_call',
                    tool: 'display_diagram',
                    args: { xml: parsed.xml }
                })}\n\n`);
            } else if (parsed.action === 'edit_diagram' && parsed.edits) {
                res.write(`data: ${JSON.stringify({
                    type: 'tool_call',
                    tool: 'edit_diagram',
                    args: { edits: parsed.edits }
                })}\n\n`);
            }
        }

        // Final parse to ensure we got everything
        const finalParsed = parseStreamContent(fullContent);
        if (finalParsed.action === 'display_diagram' && finalParsed.xml) {
            res.write(`data: ${JSON.stringify({
                type: 'tool_call',
                tool: 'display_diagram',
                args: { xml: finalParsed.xml }
            })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('[API Error]', error);

        // If headers already sent, send error as SSE
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
            res.write('data: [DONE]\n\n');
            res.end();
        } else {
            res.status(500).json({
                error: error.message || 'Internal server error',
                details: error.toString()
            });
        }
    }
});

/**
 * GET /api/health - Health check
 */
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * GET /api/providers - List available AI providers
 */
app.get('/api/providers', (req, res) => {
    res.json({
        providers: [
            { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-chat', 'deepseek-coder'] },
            { id: 'google', name: 'Google Gemini', models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'] },
            { id: 'openai', name: 'OpenAI', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'] }
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI API Server running on http://localhost:${PORT}`);
    console.log(`   - POST /api/chat - AI chat endpoint (streaming)`);
    console.log(`   - GET  /api/health - Health check`);
    console.log(`   - GET  /api/providers - List AI providers`);
});

export default app;
