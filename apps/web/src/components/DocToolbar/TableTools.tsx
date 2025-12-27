"use client";

import React from 'react';
import {
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
    Trash2, Merge, Split
} from 'lucide-react';
import { ToolbarButton, ToolbarSeparator } from '@/components/shared';

interface TableToolsProps {
    editor: any;
}

/**
 * 表格工具栏（仅在表格激活时显示）
 */
export default function TableTools({ editor }: TableToolsProps) {
    if (!editor.isActive('table')) {
        return null;
    }

    return (
        <>
            <ToolbarSeparator />
            <div className="flex items-center gap-0.5 bg-blue-50 rounded px-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                    title="上方插入行"
                >
                    <ArrowUp size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    title="下方插入行"
                >
                    <ArrowDown size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                    title="左侧插入列"
                >
                    <ArrowLeft size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                    title="右侧插入列"
                >
                    <ArrowRight size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().mergeCells().run()}
                    title="合并单元格"
                >
                    <Merge size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().splitCell().run()}
                    title="拆分单元格"
                >
                    <Split size={14} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().deleteTable().run()}
                    title="删除表格"
                    className="text-red-600 hover:bg-red-50"
                >
                    <Trash2 size={14} />
                </ToolbarButton>
            </div>
        </>
    );
}
