/**
 * 列表按钮组件
 */
import React from 'react';
import { List, ListOrdered, CheckSquare } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function ListButtons({ editor }) {
    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="无序列表"
            >
                <List size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="有序列表"
            >
                <ListOrdered size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                title="任务列表"
            >
                <CheckSquare size={18} />
            </Button>
        </div>
    );
}
