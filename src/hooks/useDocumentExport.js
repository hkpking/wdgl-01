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
    const exportAsMarkdown = useCallback((editor, title) => {
        if (!editor) return;

        const html = editor.getHTML();
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

    return {
        exportAsPDF,
        exportAsMarkdown
    };
}
