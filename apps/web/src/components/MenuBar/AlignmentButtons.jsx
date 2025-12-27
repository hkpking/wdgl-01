/**
 * 对齐方式按钮组件
 */
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function AlignmentButtons({ editor }) {
    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="左对齐"
            >
                <AlignLeft size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="居中对齐"
            >
                <AlignCenter size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="右对齐"
            >
                <AlignRight size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                title="两端对齐"
            >
                <AlignJustify size={18} />
            </Button>
        </div>
    );
}
