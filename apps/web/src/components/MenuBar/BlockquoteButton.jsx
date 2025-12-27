/**
 * 引用块按钮组件
 */
import React from 'react';
import { Quote } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function BlockquoteButton({ editor }) {
    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="引用"
            >
                <Quote size={18} />
            </Button>
        </div>
    );
}
