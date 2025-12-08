/**
 * 历史操作按钮 (Google Docs 风格)
 */
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from '../shared';

export function HistoryButtons({ editor, variant = 'google-docs' }) {
    if (!editor) return null;

    return (
        <>
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="撤销 (Ctrl+Z)"
                variant={variant}
            >
                <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="重做 (Ctrl+Y)"
                variant={variant}
            >
                <Redo size={16} />
            </ToolbarButton>
            <ToolbarSeparator variant={variant} />
        </>
    );
}
