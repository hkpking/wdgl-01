/**
 * Google Docs 风格格式按钮组件
 * 包含加粗、斜体、下划线、删除线等
 */
import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code } from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from '../shared';

export function FormatButtons({ editor, variant = 'google-docs' }) {
    if (!editor) return null;

    return (
        <>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="加粗 (Ctrl+B)"
                variant={variant}
            >
                <Bold size={16} strokeWidth={2.5} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="斜体 (Ctrl+I)"
                variant={variant}
            >
                <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="下划线 (Ctrl+U)"
                variant={variant}
            >
                <Underline size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="删除线"
                variant={variant}
            >
                <Strikethrough size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="行内代码"
                variant={variant}
            >
                <Code size={16} />
            </ToolbarButton>
            <ToolbarSeparator variant={variant} />
        </>
    );
}
