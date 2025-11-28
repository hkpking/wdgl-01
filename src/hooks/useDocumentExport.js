import { useCallback } from 'react';
import { htmlToMarkdown } from '../utils/editor';

/**
 * Hook for handling document export functionality
 * @returns {Object} Export functions
 */
export function useDocumentExport() {
    /**
     * Export the current document as PDF using the browser's print functionality
     */
    const exportAsPDF = useCallback(() => {
        window.print();
    }, []);

    /**
     * Export the current document content as a Markdown file
     * @param {Object} editor - The Tiptap editor instance
     * @param {string} title - The document title
     */
    const exportAsMarkdown = useCallback((editor, title, content) => {
        let html = '';
        if (editor) {
            html = editor.getHTML();
        } else if (content) {
            html = content;
        } else {
            return;
        }

        const markdown = htmlToMarkdown(html);
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = `${title || 'document'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    /**
     * Export the current document content as a Word (.docx) file
     * @param {string} title - The document title
     * @param {string} content - The HTML content
     */
    const exportAsWord = useCallback((title, content) => {
        if (!content) return;

        // Dynamic import to avoid SSR issues if any (though this is client-side)
        // Use global htmlDocx loaded via CDN to avoid Vite build errors
        if (window.htmlDocx) {
            import('file-saver').then((FileSaver) => {
                // Wrap content in a full HTML document structure for better styling
                const fullHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { font-family: 'SimSun', serif; }
                            table { border-collapse: collapse; width: 100%; }
                            td, th { border: 1px solid #000; padding: 8px; }
                            .risk-block { background-color: #fffbeb; padding: 10px; border: 1px solid #f59e0b; margin: 10px 0; }
                            .rule-block { background-color: #fef2f2; padding: 10px; border: 1px solid #ef4444; margin: 10px 0; }
                            .process-link-block { background-color: #f3e8ff; padding: 10px; border: 1px solid #d8b4fe; margin: 10px 0; }
                            .image-block { text-align: center; margin: 10px 0; }
                            .flowchart-block { border: 1px solid #ddd; padding: 10px; background: #f9f9f9; font-family: monospace; white-space: pre; }
                        </style>
                    </head>
                    <body>
                        <h1>${title || 'Document'}</h1>
                        ${content}
                    </body>
                    </html>
                `;

                const converted = window.htmlDocx.asBlob(fullHtml);
                FileSaver.default.saveAs(converted, `${title || 'document'}.docx`);
            });
        } else {
            console.error('html-docx-js not loaded');
            alert('Word 导出组件加载失败，请检查网络连接。');
        }
    }, []);

    return {
        exportAsPDF,
        exportAsMarkdown,
        exportAsWord
    };
}
