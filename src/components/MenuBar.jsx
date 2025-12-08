/**
 * MenuBar - 重构后的工具栏组件
 * 
 * 原文件 729 行，现在通过组件化拆分大幅简化
 */
import React from 'react';
import {
    HistoryButtons,
    FontStyleMenu,
    FormatButtons,
    ColorMenu,
    HeadingMenu,
    AlignmentButtons,
    ListButtons,
    LineHeightMenu,
    BlockquoteButton,
    InsertMenu
} from './MenuBar';

export default function MenuBar({ editor }) {
    if (!editor) {
        return null;
    }

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 sticky top-0 bg-white z-10 items-center">
            {/* 历史操作 */}
            <HistoryButtons editor={editor} />

            {/* 字体样式 */}
            <FontStyleMenu editor={editor} />

            {/* 文字格式 */}
            <FormatButtons editor={editor} />

            {/* 颜色 */}
            <ColorMenu editor={editor} />

            {/* 对齐方式 */}
            <AlignmentButtons editor={editor} />

            {/* 行高 */}
            <LineHeightMenu editor={editor} />

            {/* 标题 */}
            <HeadingMenu editor={editor} />

            {/* 列表 */}
            <ListButtons editor={editor} />

            {/* 引用 */}
            <BlockquoteButton editor={editor} />

            {/* 插入菜单 */}
            <InsertMenu editor={editor} />
        </div>
    );
}
