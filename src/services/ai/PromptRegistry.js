/**
 * Centralized registry for AI prompts.
 * Ensures consistency and easy tuning of prompts.
 */

export const PromptRegistry = {
    /**
     * Generate a structured outline from a topic
     * @param {string} topic 
     */
    GENERATE_OUTLINE: (topic) => `
You are an expert document architect.
Create a detailed, hierarchical outline for a document about: "${topic}".
Format the output as a clean Markdown list (using -, *, or 1. for levels).
Do not include any introductory text or explanations, just the outline.
    `,

    /**
     * Summarize the provided text
     * @param {string} text 
     */
    SUMMARIZE: (text) => `
Summarize the following text concisely, capturing the key points:

"${text}"
    `,

    /**
     * Expand on a specific point
     * @param {string} text 
     */
    EXPAND: (text) => `
Expand on the following text, adding more detail, examples, and context:

"${text}"
    `,

    /**
     * Change the tone of the text
     * @param {string} text 
     * @param {string} tone - e.g., "Professional", "Casual", "Academic"
     */
    CHANGE_TONE: (text, tone) => `
Rewrite the following text to have a ${tone} tone:

"${text}"
    `
};
