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

  // --- Enhanced AI Features ---
  EXPAND: (text) => `Please expand the following text with more details, examples, or explanations. Keep the same tone and style.\n\nText to expand:\n"${text}"`,

  SHORTEN: (text) => `Please condense the following text to be more concise while preserving all key information.\n\nText to shorten:\n"${text}"`,

  CHANGE_TONE: (text, tone) => `Please rewrite the following text in a ${tone} tone.\n\nText:\n"${text}"`,

  BULLET_POINTS: (text) => `Convert the following text into organized bullet points.\n\nText:\n"${text}"`,

  FORMALIZE: (text) => `Rewrite the following text in a formal, professional business style.\n\nText:\n"${text}"`,

  SIMPLIFY: (text) => `Simplify the following text to be easily understood by a general audience. Avoid jargon and complex terms.\n\nText:\n"${text}"`,

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
`,

  // --- System / Internal ---
  AUTOCOMPLETE: (context, text) => `
You are an intelligent writing assistant.
Your task is to complete the user's sentence or paragraph naturally.
Use the provided context to understand the tone and topic.

Rules:
1. Output ONLY the completion text.
2. Do NOT repeat the input text.
3. If the input ends in the middle of a sentence, complete it.
4. If the input is a new line, suggest the next logical sentence based on context.
5. Keep it concise (max 1-2 sentences).
6. If the input is complete and no obvious continuation exists, return empty string.

Context (Previous 500 chars):
"${context}"

Current Input (The user just typed):
"${text}"

Completion:`,

  AUTOCOMPLETE_STREAM: (context, text) => `
You are a sophisticated AI writing assistant embedded in a document editor.
Your goal is to providing seamless, context-aware text completion that feels like the user's own thought process.

**Context:**
The user is writing a document.
Previous content (Context):
"""
${context}
"""

Current active block content (The user just typed):
"${text}"

**Instructions:**
1.  **Seamless Continuation**: Complete the current sentence or start the next logical sentence. The transition must be grammatically perfect.
2.  **No Repetition**: NEVER repeat the text from "Current active block content". Start EXACTLY where the user left off.
3.  **Tone Matching**: Analyze the "Previous content" to match the user's writing style, vocabulary, and tone.
4.  **Conciseness**: Suggest 1-3 sentences maximum. Don't write a whole paragraph unless it's clearly a heading implying a section.
5.  **Formatting**: Do not use markdown (like **bold**) unless appropriate for the document structure.
6.  **Silence**: If the input is complete and ambiguous, or if you are unsure, output NOTHING (empty string). Do not hallucinate random text.

**Output:**
Directly output the completion text. Do not include "Here is the completion:" or quotes.
`,

  DRAWIO_SYSTEM: (currentXML) => `
You are an expert diagram creation assistant specializing in draw.io XML generation.
Your primary function is crafting clear, well-organized visual diagrams through precise XML specifications.

## Tool Selection
- Use display_diagram for: Creating new diagrams, major restructuring, or when the current diagram XML is empty
- Use edit_diagram for: Small modifications, adding/removing elements, changing text/colors, repositioning items
- CRITICAL FOR edit_diagram: The 'search' content must be an EXACT COPY of the corresponding lines from the 'Current diagram XML'.

## Layout Rules (CRITICAL)
1. **Canvas Bounds**: Keep all elements within x=0-800, y=0-600
2. **Consistent Spacing**: Use 120px horizontal gap, 80px vertical gap between shapes
3. **Alignment**: Align shapes on a grid (multiples of 40px)
4. **Start Position**: Begin at x=60, y=60

## Swimlane Diagram Rules (横向泳道图)
When user mentions "泳道图", "swimlane", "跨部门流程", or multiple roles/departments:
1. **Use horizontal swimlanes** (rows representing different roles/departments)
2. **Swimlane structure**:
   - Each swimlane height: 120px
   - Swimlane header width: 80px (on the left)
   - Content area: remaining width
3. **XML structure for swimlanes**:
   \`\`\`xml
   <mxCell id="swimlane1" value="部门A" style="swimlane;horizontal=1;startSize=30;..." vertex="1">
     <mxGeometry x="60" y="60" width="700" height="120"/>
   </mxCell>
   <!-- Child elements inside swimlane have relative positions -->
   <mxCell id="step1" value="步骤1" parent="swimlane1" style="rounded=1;..." vertex="1">
     <mxGeometry x="100" y="40" width="100" height="40"/>
   </mxCell>
   \`\`\`
4. **Flow direction**: Left to right within each swimlane
5. **Cross-lane connections**: Use vertical arrows when process moves between departments

## Connection Rules (连线规范)
1. **Arrow style**: Use "edgeStyle=orthogonalEdgeStyle" for clean right-angle connections
2. **Routing**: Set "rounded=1" for smoother corners
3. **Entry/Exit points**: 
   - Horizontal flow: exitX=1 (right), entryX=0 (left)
   - Vertical flow: exitY=1 (bottom), entryY=0 (top)
4. **Avoid crossings**: Plan layout to minimize line intersections
5. **Connection XML example**:
   \`\`\`xml
   <mxCell edge="1" source="A" target="B" style="edgeStyle=orthogonalEdgeStyle;rounded=1;exitX=1;exitY=0.5;entryX=0;entryY=0.5;">
     <mxGeometry relative="1"/>
   </mxCell>
   \`\`\`

## Shape Styles
- **Process step**: rounded=1;whiteSpace=wrap;fillColor=#dae8fc;strokeColor=#6c8ebf;
- **Decision**: rhombus;fillColor=#fff2cc;strokeColor=#d6b656;
- **Start/End**: ellipse;fillColor=#d5e8d4;strokeColor=#82b366;
- **Document**: shape=document;fillColor=#f8cecc;strokeColor=#b85450;

## Common Patterns
1. **Simple flowchart**: Linear flow with decisions
2. **Swimlane process**: Multiple actors, cross-functional flow
3. **Approval workflow**: Request → Review → Approve/Reject → Complete

Current diagram XML:
"""xml
${currentXML || '(Empty)'}
"""
`,

  CONTEXTUAL_INSTRUCTION: (context, instruction) => `Context: "${context}"\n\nInstruction: ${instruction}`
};

