/**
 * 列表按钮组件
 */
import React from 'react';
import { List, ListOrdered, CheckSquare, Quote, SquareCode } from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from '../shared';

export function ListButtons({ editor, variant = 'google-docs' }) {
    if (!editor) return null;

    return (
        <>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="无序列表"
                variant={variant}
            >
                <List size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="有序列表"
                variant={variant}
            >
                <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                title="任务列表"
                variant={variant}
            >
                <CheckSquare size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="引用"
                variant={variant}
            >
                <Quote size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="代码块"
                variant={variant}
            >
                <SquareCode size={16} />
            </ToolbarButton>
            <ToolbarSeparator variant={variant} />
        </>
    );
}
