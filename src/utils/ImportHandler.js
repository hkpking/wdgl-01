import * as mammoth from 'mammoth';

/**
 * Imports a Word document (.docx) and converts it to HTML.
 * @param {File} file - The .docx file to import.
 * @returns {Promise<string>} - A promise that resolves to the converted HTML string.
 */
export const importWordDoc = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;
                const options = {
                    styleMap: [
                        "p[style-name='封面文档标题'] => h1.doc-title",
                        "p[style-name='封面表格文本'] => p.table-text",
                        "r[style-name='Emphasis'] => em",
                        "p[style-name='List Paragraph'] => ul > li:fresh"
                    ]
                };

                // Fix for Vite/Rollup CommonJS interop
                const convertToHtml = mammoth.convertToHtml || (mammoth.default ? mammoth.default.convertToHtml : null);

                if (!convertToHtml) {
                    throw new Error('Mammoth library not loaded correctly');
                }

                console.log('[Import] Starting conversion for:', file.name);
                const result = await convertToHtml({ arrayBuffer: arrayBuffer }, options);

                if (result.messages.length > 0) {
                    console.log("[Import] Mammoth messages:", result.messages);
                }

                // Post-process HTML to fix Tiptap schema errors
                let html = result.value;

                if (!html || !html.trim()) {
                    console.warn('[Import] Warning: Converted HTML is empty');
                }

                // Tiptap requires table cells to have content.
                html = html.replace(/<td>\s*<\/td>/g, '<td><p>&nbsp;</p></td>');

                // Ensure images have max-width to prevent overflow and allow resizing defaults
                html = html.replace(/<img /g, '<img style="max-width: 100%; height: auto;" ');

                console.log('[Import] Conversion successful, length:', html.length);
                resolve(html); // The generated HTML
            } catch (error) {
                console.error('[Import] Error:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};
