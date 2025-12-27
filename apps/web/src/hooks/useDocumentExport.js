import { useCallback } from 'react';
import { htmlToMarkdown } from '@/lib/editor-utils';
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, Packer, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

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
     * 将 HTML 转换为 docx.js 的文档元素
     */
    const htmlToDocxElements = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const elements = [];

        const processNode = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    return [new TextRun(text)];
                }
                return [];
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return [];
            }

            const tagName = node.tagName.toLowerCase();

            switch (tagName) {
                case 'h1':
                    return [new Paragraph({
                        children: [new TextRun({ text: node.textContent, bold: true, size: 32 })],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { before: 240, after: 120 }
                    })];
                case 'h2':
                    return [new Paragraph({
                        children: [new TextRun({ text: node.textContent, bold: true, size: 28 })],
                        heading: HeadingLevel.HEADING_2,
                        spacing: { before: 200, after: 100 }
                    })];
                case 'h3':
                    return [new Paragraph({
                        children: [new TextRun({ text: node.textContent, bold: true, size: 24 })],
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 160, after: 80 }
                    })];
                case 'p':
                    const runs = [];
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            runs.push(new TextRun(child.textContent));
                        } else if (child.nodeType === Node.ELEMENT_NODE) {
                            const childTag = child.tagName.toLowerCase();
                            const text = child.textContent;
                            if (childTag === 'strong' || childTag === 'b') {
                                runs.push(new TextRun({ text, bold: true }));
                            } else if (childTag === 'em' || childTag === 'i') {
                                runs.push(new TextRun({ text, italics: true }));
                            } else if (childTag === 'u') {
                                runs.push(new TextRun({ text, underline: {} }));
                            } else if (childTag === 's' || childTag === 'del') {
                                runs.push(new TextRun({ text, strike: true }));
                            } else if (childTag === 'code') {
                                runs.push(new TextRun({ text, font: 'Courier New', shading: { fill: 'E5E7EB' } }));
                            } else if (childTag === 'a') {
                                runs.push(new TextRun({ text, color: '2563EB', underline: { type: 'single' } }));
                            } else {
                                runs.push(new TextRun(text));
                            }
                        }
                    });
                    return [new Paragraph({ children: runs, spacing: { after: 120 } })];

                case 'ul':
                case 'ol':
                    const listItems = [];
                    node.querySelectorAll(':scope > li').forEach((li, index) => {
                        const bullet = tagName === 'ul' ? '• ' : `${index + 1}. `;
                        listItems.push(new Paragraph({
                            children: [new TextRun(bullet + li.textContent)],
                            indent: { left: 720 },
                            spacing: { after: 60 }
                        }));
                    });
                    return listItems;

                case 'blockquote':
                    return [new Paragraph({
                        children: [new TextRun({ text: node.textContent, italics: true, color: '6B7280' })],
                        indent: { left: 720 },
                        border: { left: { color: 'D1D5DB', size: 24, style: BorderStyle.SINGLE } },
                        spacing: { before: 120, after: 120 }
                    })];

                case 'pre':
                    return [new Paragraph({
                        children: [new TextRun({ text: node.textContent, font: 'Courier New', size: 20 })],
                        shading: { fill: 'F3F4F6' },
                        spacing: { before: 120, after: 120 }
                    })];

                case 'table':
                    try {
                        const rows = [];
                        node.querySelectorAll('tr').forEach(tr => {
                            const cells = [];
                            tr.querySelectorAll('td, th').forEach(cell => {
                                cells.push(new TableCell({
                                    children: [new Paragraph({ children: [new TextRun(cell.textContent)] })],
                                    width: { size: 100 / (tr.children.length || 1), type: WidthType.PERCENTAGE },
                                    borders: {
                                        top: { style: BorderStyle.SINGLE, size: 1 },
                                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                                        left: { style: BorderStyle.SINGLE, size: 1 },
                                        right: { style: BorderStyle.SINGLE, size: 1 }
                                    }
                                }));
                            });
                            if (cells.length > 0) {
                                rows.push(new TableRow({ children: cells }));
                            }
                        });
                        if (rows.length > 0) {
                            return [new Table({
                                rows,
                                width: { size: 100, type: WidthType.PERCENTAGE }
                            })];
                        }
                    } catch (e) {
                        console.warn('Table conversion failed:', e);
                    }
                    return [];

                case 'hr':
                    return [new Paragraph({
                        children: [new TextRun({ text: '─'.repeat(50), color: 'D1D5DB' })],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 240, after: 240 }
                    })];

                case 'br':
                    return [new Paragraph({})];

                case 'div':
                case 'section':
                case 'article':
                    const divChildren = [];
                    node.childNodes.forEach(child => {
                        divChildren.push(...processNode(child));
                    });
                    return divChildren;

                default:
                    // 处理其他未知标签，尝试递归处理子节点
                    const defaultChildren = [];
                    node.childNodes.forEach(child => {
                        defaultChildren.push(...processNode(child));
                    });
                    if (defaultChildren.length === 0 && node.textContent.trim()) {
                        return [new Paragraph({ children: [new TextRun(node.textContent)] })];
                    }
                    return defaultChildren;
            }
        };

        doc.body.childNodes.forEach(node => {
            elements.push(...processNode(node));
        });

        return elements;
    };

    /**
     * Export the current document content as a Word (.docx) file using docx.js
     * @param {string} title - The document title
     * @param {string} content - The HTML content
     */
    const exportAsWord = useCallback(async (title, content) => {
        if (!content) return;

        try {
            // 转换 HTML 为 docx 元素
            const contentElements = htmlToDocxElements(content);

            // 创建文档
            const doc = new Document({
                creator: '制度管理系统',
                title: title || 'Document',
                styles: {
                    default: {
                        document: {
                            run: {
                                font: 'SimSun',
                                size: 24 // 12pt
                            }
                        }
                    }
                },
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: 1440, // 1 inch = 1440 twips
                                right: 1440,
                                bottom: 1440,
                                left: 1440
                            }
                        }
                    },
                    children: [
                        // 标题
                        new Paragraph({
                            children: [new TextRun({ text: title || 'Document', bold: true, size: 36 })],
                            heading: HeadingLevel.TITLE,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 }
                        }),
                        // 正文内容
                        ...contentElements
                    ]
                }]
            });

            // 生成并下载
            const blob = await Packer.toBlob(doc);
            saveAs(blob, `${title || 'document'}.docx`);

        } catch (error) {
            console.error('Word export failed:', error);
            alert('Word 导出失败: ' + error.message);
        }
    }, []);

    return {
        exportAsPDF,
        exportAsMarkdown,
        exportAsWord
    };
}
