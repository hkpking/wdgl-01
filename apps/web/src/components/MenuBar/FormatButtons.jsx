/**
 * 文本格式按钮组件
 * 包含加粗、斜体、删除线、下划线、代码等格式化按钮
 */
import React from 'react';
import {
    Bold, Italic, Strikethrough, Code, Underline
} from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function FormatButtons({ editor }) {
    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="加粗"
            >
                <Bold size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="斜体"
            >
                <Italic size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="下划线"
            >
                <Underline size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="删除线"
            >
                <Strikethrough size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="行内代码"
            >
                <Code size={18} />
            </Button>
        </div>
    );
}
