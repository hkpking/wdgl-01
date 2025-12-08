/**
 * 对齐方式按钮组件
 */
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from '../shared';

export function AlignmentButtons({ editor, variant = 'google-docs' }) {
    if (!editor) return null;

    return (
        <>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="左对齐"
                variant={variant}
            >
                <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="居中"
                variant={variant}
            >
                <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="右对齐"
                variant={variant}
            >
                <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                title="两端对齐"
                variant={variant}
            >
                <AlignJustify size={16} />
            </ToolbarButton>
            <ToolbarSeparator variant={variant} />
        </>
    );
}
