/**
 * Utility to convert between HTML and Structured Blocks
 */

/**
 * Convert HTML string to Blocks array
 * @param {string} html 
 * @returns {Array} blocks
 */
export function htmlToBlocks(html) {
    if (!html) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks = [];

    // Helper to create block
    const createBlock = (type, content, level = 1, indent = 0, number = '') => ({
        id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
        type,
        level: type === 'heading' ? level : undefined,
        indent: type === 'clause' ? indent : 0, // Add indent property
        number: number, // Use extracted number
        content: content || '',
        meta: {}
    });

    // Iterate over body children
    Array.from(doc.body.children).forEach((node) => {
        const tagName = node.tagName.toLowerCase();
        let content = node.textContent.trim();
        let indent = 0;
        let number = '';

        // 1. Style-Based Indentation (Best Practice)
        // Check for margin-left or padding-left in style attribute
        const style = node.getAttribute('style') || '';
        const marginMatch = style.match(/(?:margin|padding)-left:\s*(\d+)(?:pt|px|em)/i);
        if (marginMatch) {
            const value = parseFloat(marginMatch[1]);
            // Heuristic: 20px/15pt per level. Word usually uses 18pt or 24px per indent.
            // Let's assume 20px as a safe base unit.
            indent = Math.floor(value / 20);
        }

        // 2. Heading Tags (Explicit Hierarchy)
        if (tagName.startsWith('h') && tagName.length === 2) {
            const level = parseInt(tagName[1]);
            // Headings are usually top-level, but h2 is "indented" relative to h1 logic-wise.
            // But in our block model, headings are distinct types.
            // We can treat them as indent 0 usually.
            blocks.push(createBlock('heading', content, level, 0, ''));
            return;
        }

        // 3. Numbering Pattern (Fallback & Number Extraction)
        // Even if we have style indent, we still want to extract the number string if present.
        const numberMatch = content.match(/^(\d+(\.\d+)*|[一二三四五六七八九十]+)[.、\s]/);
        if (numberMatch) {
            number = numberMatch[0].trim();

            // If no style indent was found, fallback to dot counting
            if (indent === 0) {
                const numberStr = numberMatch[1];
                if (numberStr) {
                    const dotCount = (numberStr.match(/\./g) || []).length;
                    indent = dotCount;
                }
            }

            // Strip numbering from content
            content = content.replace(/^(\d+(\.\d+)*|[一二三四五六七八九十]+)[.、\s]\s*/, '');
        }

        if (!content && tagName !== 'hr') return; // Skip empty nodes unless HR

        if (tagName === 'p') {
            // Check for images inside p
            const img = node.querySelector('img');
            if (img) {
                blocks.push({
                    id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    content: '',
                    meta: { src: img.src, caption: img.alt || '' }
                });
            } else {
                blocks.push(createBlock('clause', content, 1, indent, number));
            }
        } else if (tagName === 'img') {
            // Check if it's a draw.io image
            if (node.getAttribute('data-drawio-xml')) {
                blocks.push({
                    id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'flowchart',
                    content: '',
                    meta: {
                        xml: node.getAttribute('data-drawio-xml'),
                        previewUrl: node.src
                    }
                });
            } else {
                blocks.push({
                    id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'image',
                    content: '',
                    meta: { src: node.src, caption: node.alt || '' }
                });
            }
        } else if (tagName === 'table') {
            const rows = Array.from(node.querySelectorAll('tr'));
            const data = rows.map(row => {
                return Array.from(row.querySelectorAll('td, th')).map(cell => cell.textContent.trim());
            });
            const rowCount = data.length;
            const colCount = rowCount > 0 ? data[0].length : 0;

            if (rowCount > 0 && colCount > 0) {
                blocks.push({
                    id: `BLK-${Math.random().toString(36).substr(2, 9)}`,
                    type: 'table',
                    content: '',
                    meta: { rows: rowCount, cols: colCount, data: data }
                });
            }
        } else if (tagName === 'ul' || tagName === 'ol') {
            // Convert list items to clauses
            Array.from(node.children).forEach(li => {
                blocks.push(createBlock('clause', li.textContent.trim(), 1, indent + 1, '')); // Lists are naturally indented +1
            });
        } else if (tagName === 'div') {
            blocks.push(createBlock('clause', content, 1, indent, number));
        } else {
            // Default fallback
            blocks.push(createBlock('clause', content, 1, indent, number));
        }
    });

    // If empty, return at least one block
    if (blocks.length === 0) {
        blocks.push(createBlock('heading', 'Untitled Document', 1));
    }

    return mergeSmartly(blocks);
}

/**
 * Smartly merge fragmented blocks (Industry Best Practice)
 * Merges adjacent clauses if the first one doesn't look like a complete sentence.
 */
function mergeSmartly(blocks) {
    const merged = [];

    blocks.forEach((block, index) => {
        if (index === 0) {
            merged.push(block);
            return;
        }

        const prev = merged[merged.length - 1];

        // Only merge if both are clauses and have no special numbering
        // We removed the strict indent check because fragmented lines often have inconsistent indentation
        // (e.g. hanging indents in PDF imports).
        if (prev.type === 'clause' && block.type === 'clause' &&
            !prev.number && !block.number // Don't merge numbered items
        ) {
            // Check if previous block ends with sentence-ending punctuation
            // Added comma (，) as a non-ending punctuation to be safe, though usually we split on periods.
            // Actually, we want to MERGE if it does NOT end in period/question/exclamation.
            const punctuation = /[。！？.!?]$/; // Strict sentence endings. Colon/Semicolon usually mean list follows, so maybe don't merge?
            // User case: "采购部门执" (ends in char). 
            // Let's stick to: If it DOES NOT end in strict punctuation, merge.

            if (!punctuation.test(prev.content.trim())) {
                // Previous block looks unfinished
                // Removed space for Chinese content? 
                // For English we need space. For Chinese usually no space if it was a hard wrap.
                // Heuristic: If prev ends in English char or digit, add space.
                if (/[a-zA-Z0-9]$/.test(prev.content.trim())) {
                    prev.content += ' ';
                }
                prev.content += block.content;
                return; // Skip pushing this block as new
            }
        }

        merged.push(block);
    });

    return merged;
}

/**
 * Convert Blocks array to HTML string (for export/backward compatibility)
 * @param {Array} blocks 
 * @returns {string} html
 */
export function blocksToHtml(blocks) {
    if (!Array.isArray(blocks)) return '';

    return blocks.map(block => {
        if (block.type === 'heading') {
            return `<h${block.level}>${escapeHtml(block.content)}</h${block.level}>`;
        } else if (block.type === 'clause') {
            return `<p>${escapeHtml(block.content)}</p>`;
        } else if (block.type === 'risk') {
            return `<div class="risk-block" style="background-color: #fffbeb; padding: 10px; border-left: 4px solid #f59e0b;"><strong>[Risk]</strong> ${escapeHtml(block.content)}</div>`;
        } else if (block.type === 'rule') {
            return `<div class="rule-block" style="background-color: #fef2f2; padding: 10px; border-left: 4px solid #ef4444;"><strong>[Rule]</strong> ${escapeHtml(block.content)}</div>`;
        } else if (block.type === 'image') {
            return `<div class="image-block" style="text-align: center; margin: 20px 0;">
                <img src="${block.meta.src}" alt="${escapeHtml(block.meta.caption)}" style="max-width: 100%; height: auto;" />
                <p style="font-size: 0.9em; color: #666;">${escapeHtml(block.meta.caption)}</p>
            </div>`;
        } else if (block.type === 'table') {
            const rows = block.meta.data.map(row =>
                `<tr>${row.map(cell => `<td style="border: 1px solid #ccc; padding: 8px;">${escapeHtml(cell)}</td>`).join('')}</tr>`
            ).join('');
            return `<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">${rows}</table>`;
        } else if (block.type === 'flowchart') {
            if (block.meta.previewUrl) {
                return `<div class="flowchart-block" style="text-align: center; margin: 20px 0;">
                    <img src="${block.meta.previewUrl}" alt="Flowchart" data-drawio-xml="${escapeHtml(block.meta.xml || '')}" style="max-width: 100%; height: auto;" />
                </div>`;
            } else {
                return `<div class="flowchart-block" style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; background: #f9f9f9;">
                    <pre>${escapeHtml(block.meta.code)}</pre>
                    <p style="font-size: 0.8em; color: #888;">[Flowchart Diagram]</p>
                </div>`;
            }
        } else if (block.type === 'process_link') {
            return `<div class="process-link-block" style="background-color: #f3e8ff; padding: 10px; border: 1px solid #d8b4fe;"><strong>[Process Link]</strong> ${escapeHtml(block.content)}</div>`;
        } else if (block.type === 'process_card') {
            return `<div class="process-card-block" style="background-color: #e0e7ff; padding: 15px; border: 1px solid #c7d2fe; border-radius: 8px; margin: 10px 0;">
                <h3 style="margin-top: 0; color: #3730a3;">${escapeHtml(block.meta.title || 'Process Card')}</h3>
                <p>${escapeHtml(block.meta.description || '')}</p>
                ${block.meta.fields ? `<ul style="list-style: none; padding: 0;">
                    ${Object.entries(block.meta.fields).map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join('')}
                </ul>` : ''}
            </div>`;
        } else if (block.type === 'architecture_matrix') {
            return `<div class="architecture-matrix-block" style="border: 1px solid #cbd5e1; padding: 20px; margin: 20px 0; background-color: #f8fafc;">
                <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">[架构矩阵] ${escapeHtml(block.meta.root?.title || 'Architecture Matrix')}</h3>
                <p style="font-size: 0.9em; color: #64748b; font-style: italic;">(注：完整图形请使用"导出图片"功能)</p>
            </div>`;
        }
        return `<p>${escapeHtml(block.content)}</p>`;
    }).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
