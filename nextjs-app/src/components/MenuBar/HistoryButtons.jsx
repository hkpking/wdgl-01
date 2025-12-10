/**
 * 历史操作按钮组件 (撤销/重做)
 */
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function HistoryButtons({ editor }) {
    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="撤销"
            >
                <Undo size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="重做"
            >
                <Redo size={18} />
            </Button>
        </div>
    );
}
