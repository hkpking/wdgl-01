import React, { useState, useEffect, useMemo } from 'react';
import { AlignLeft, ChevronRight, ChevronDown, FileText, Type, Hash } from 'lucide-react';

export default function DocOutline({ editor }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(true);
    const [collapsedSections, setCollapsedSections] = useState(new Set());

    // 字数统计
    const stats = useMemo(() => {
        if (!editor) return { chars: 0, words: 0, paragraphs: 0 };

        const text = editor.state.doc.textContent;
        const chars = text.length;
        // 中文按字符计数，英文按单词计数
        const words = text.replace(/[\u4e00-\u9fa5]/g, ' ').split(/\s+/).filter(Boolean).length +
            (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        const paragraphs = editor.state.doc.content.content.filter(
            node => node.type.name === 'paragraph' && node.textContent.trim()
        ).length;

        return { chars, words, paragraphs };
    }, [editor?.state.doc]);

    useEffect(() => {
        if (!editor) return;

        const updateHeadings = () => {
            const newHeadings = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                    newHeadings.push({
                        level: node.attrs.level,
                        text: node.textContent,
                        pos: pos,
                        id: `heading-${pos}`
                    });
                }
            });
            setHeadings(newHeadings);
        };

        updateHeadings();
        editor.on('update', updateHeadings);

        return () => {
            editor.off('update', updateHeadings);
        };
    }, [editor]);

    // Active Heading Detection
    useEffect(() => {
        if (!editor || headings.length === 0) return;

        const handleScroll = () => {
            let currentActiveId = null;
            let minDistance = Infinity;

            for (const heading of headings) {
                try {
                    const dom = editor.view.nodeDOM(heading.pos);
                    if (dom && dom.getBoundingClientRect) {
                        const rect = dom.getBoundingClientRect();
                        const distance = Math.abs(rect.top - 100);
                        if (distance < minDistance) {
                            minDistance = distance;
                            currentActiveId = heading.id;
                        }
                    }
                } catch (e) {
                    // Ignore errors
                }
            }

            if (currentActiveId) {
                setActiveId(currentActiveId);
            }
        };

        const scrollContainer = editor.view.dom.closest('.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            handleScroll();
        } else {
            window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, [editor, headings]);

    const handleHeadingClick = (pos) => {
        if (editor) {
            const dom = editor.view.nodeDOM(pos);
            if (dom && dom.scrollIntoView) {
                dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setActiveId(`heading-${pos}`);
        }
    };

    const toggleSection = (id) => {
        setCollapsedSections(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // 构建层级结构用于折叠
    const getChildHeadings = (parentIndex) => {
        const parent = headings[parentIndex];
        if (!parent) return [];

        const children = [];
        for (let i = parentIndex + 1; i < headings.length; i++) {
            if (headings[i].level <= parent.level) break;
            children.push(i);
        }
        return children;
    };

    const isHidden = (index) => {
        // 检查是否有任何父级被折叠
        for (let i = index - 1; i >= 0; i--) {
            const parent = headings[i];
            if (parent.level < headings[index].level) {
                if (collapsedSections.has(parent.id)) {
                    return true;
                }
            }
        }
        return false;
    };

    if (!editor) return null;

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden lg:flex sticky top-0">
            {/* Header */}
            <div
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 text-gray-600">
                    <AlignLeft size={18} />
                    <span className="font-medium text-sm">文档大纲</span>
                </div>
                {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
            </div>

            {isExpanded && (
                <>
                    {/* 字数统计 */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Type size={12} />
                                <span>{stats.chars} 字符</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Hash size={12} />
                                <span>{stats.words} 词</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FileText size={12} />
                                <span>{stats.paragraphs} 段</span>
                            </div>
                        </div>
                    </div>

                    {/* 大纲列表 */}
                    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                        {headings.length === 0 ? (
                            <div className="text-sm text-gray-400 italic text-center mt-10">
                                暂无标题
                                <br />
                                <span className="text-xs">添加标题以在此处显示</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-0.5">
                                {headings.map((heading, index) => {
                                    if (isHidden(index)) return null;

                                    const hasChildren = getChildHeadings(index).length > 0;
                                    const isCollapsed = collapsedSections.has(heading.id);

                                    return (
                                        <div key={index} className="flex items-center">
                                            {/* 折叠按钮 */}
                                            {hasChildren ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSection(heading.id);
                                                    }}
                                                    className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600"
                                                >
                                                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                                                </button>
                                            ) : (
                                                <div className="w-4" />
                                            )}

                                            {/* 标题按钮 */}
                                            <button
                                                onClick={() => handleHeadingClick(heading.pos)}
                                                className={`flex-1 text-left text-sm py-1.5 px-2 rounded truncate transition-all duration-200
                                                    ${activeId === heading.id
                                                        ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-500'
                                                        : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900 border-l-2 border-transparent'}
                                                    ${heading.level === 1 ? 'font-medium' : ''}
                                                    ${heading.level === 2 ? 'ml-2 text-[13px]' : ''}
                                                    ${heading.level === 3 ? 'ml-4 text-xs text-gray-500' : ''}
                                                    ${heading.level >= 4 ? 'ml-6 text-xs text-gray-400' : ''}
                                                `}
                                                title={heading.text}
                                            >
                                                {heading.text || '(无标题)'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
