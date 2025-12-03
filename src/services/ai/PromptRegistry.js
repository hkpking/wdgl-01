/**
 * Registry for AI Prompts to ensure consistency and easy updates.
 */
export const PromptRegistry = {
    // --- Text Refinement ---
    POLISH: (text) => `You are a professional editor. Please polish the following text to make it more professional, concise, and clear, while maintaining the original meaning.\n\nText to polish:\n"${text}"`,

    FIX_GRAMMAR: (text) => `Please check the following text for grammar, spelling, and punctuation errors. Output only the corrected text.\n\nText to check:\n"${text}"`,

    TRANSLATE: (text, lang = 'English') => `Please translate the following text into ${lang}. Output only the translated text.\n\nText to translate:\n"${text}"`,

    SUMMARIZE: (text) => `Please summarize the following text into one concise sentence.\n\nText to summarize:\n"${text}"`,

    CONTINUE: (text) => `Please continue writing based on the following text. Maintain the same tone and style.\n\nContext:\n"${text}"`,

    // --- Structured Generation ---
    GENERATE_OUTLINE: (topic) => `Please generate a structured document outline for the topic: "${topic}". Use Markdown headers (#, ##, ###).`,

    GENERATE_MERMAID: (description) => `
You are an expert in Mermaid.js.
Please generate a Mermaid flowchart based on the following description: "${description}".
Rules:
1. Output ONLY the mermaid code block (starting with \`\`\`mermaid).
2. Use 'graph TD' or 'graph LR'.
3. Ensure syntax is valid.
4. Do not include explanations.
`,

    GENERATE_TABLE: (description) => `
Please generate a Markdown table based on the following description: "${description}".
Rules:
1. Output ONLY the markdown table.
2. Ensure columns are aligned.
3. Do not include explanations.
`
};
