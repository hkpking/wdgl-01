"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { List, ChevronRight, ChevronDown, AlignLeft } from 'lucide-react';

interface OutlineItem {
    id: string;
    text: string;
    level: number;
}

interface DocOutlinePanelProps {
    editor: any; // TipTap Editor instance
    className?: string;
    isOpen?: boolean;
    onToggle?: () => void;
}

/**
 * 从编辑器内容提取标题结构
 */
function extractHeadings(editor: any): OutlineItem[] {
    if (!editor) return [];

    const headings: OutlineItem[] = [];
    const doc = editor.state.doc;

    doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'heading') {
            const id = `heading-${pos}`;
            const text = node.textContent || '无标题';
            const level = node.attrs.level || 1;
            headings.push({ id, text, level });
        }
    });

    return headings;
}

/**
 * 大纲面板组件
 * 显示文档的标题结构，支持点击跳转
 */
export default function DocOutlinePanel({
    editor,
    className = '',
    isOpen = true,
    onToggle
}: DocOutlinePanelProps) {
    const [headings, setHeadings] = useState<OutlineItem[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);

    // 监听编辑器内容变化
    useEffect(() => {
        if (!editor) return;

        const updateHeadings = () => {
            setHeadings(extractHeadings(editor));
        };

        // 初始提取
        updateHeadings();

        // 监听更新
        editor.on('update', updateHeadings);

        return () => {
            editor.off('update', updateHeadings);
        };
    }, [editor]);

    // 点击标题跳转
    const handleHeadingClick = (item: OutlineItem) => {
        if (!editor) return;

        const pos = parseInt(item.id.split('-')[1]);

        // 设置选区到标题位置
        editor.chain()
            .focus()
            .setTextSelection(pos + 1)
            .run();

        // 滚动到可见位置
        const element = editor.view.domAtPos(pos + 1)?.node as HTMLElement;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setActiveId(item.id);
    };

    // 大纲标题层级缩进
    const getIndent = (level: number) => {
        return (level - 1) * 12;
    };

    if (headings.length === 0) {
        return null;
    }

    return (
        <div className={`bg-white border-l border-gray-200 ${className}`}>
            {/* 面板头部 */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                <button
                    onClick={onToggle}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    <AlignLeft size={14} />
                    <span>大纲</span>
                    {onToggle && (
                        isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    )}
                </button>
                <span className="text-xs text-gray-400">{headings.length} 个标题</span>
            </div>

            {/* 大纲列表 */}
            {isOpen && (
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                    <div className="py-2">
                        {headings.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleHeadingClick(item)}
                                className={`
                                    w-full text-left px-3 py-1.5 text-sm transition
                                    hover:bg-gray-50
                                    ${activeId === item.id
                                        ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-500'
                                        : 'text-gray-700'
                                    }
                                `}
                                style={{ paddingLeft: `${12 + getIndent(item.level)}px` }}
                            >
                                <span className={`
                                    truncate block
                                    ${item.level === 1 ? 'font-medium' : ''}
                                    ${item.level >= 3 ? 'text-gray-500' : ''}
                                `}>
                                    {item.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * 迷你大纲按钮（用于工具栏）
 */
export function OutlineToggle({
    headingCount,
    isOpen,
    onClick
}: {
    headingCount: number;
    isOpen: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                p-2 rounded-lg transition flex items-center gap-1
                ${isOpen
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }
            `}
            title="文档大纲"
        >
            <List size={18} />
            {headingCount > 0 && (
                <span className="text-xs">{headingCount}</span>
            )}
        </button>
    );
}
