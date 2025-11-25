import React, { useState, useEffect } from 'react';
import { AlignLeft, ChevronRight } from 'lucide-react';

export default function DocOutline({ editor }) {
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        if (!editor) return;

        const updateHeadings = () => {
            const newHeadings = [];
            const transaction = editor.state.tr;

            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                    const id = `heading-${pos}`;
                    // Assign an ID to the node if it doesn't have one (optional, but good for linking)
                    // For now, we'll just use the position to scroll
                    newHeadings.push({
                        level: node.attrs.level,
                        text: node.textContent,
                        pos: pos
                    });
                }
            });
            setHeadings(newHeadings);
        };

        // Initial update
        updateHeadings();

        // Subscribe to updates
        editor.on('update', updateHeadings);

        return () => {
            editor.off('update', updateHeadings);
        };
    }, [editor]);

    const handleHeadingClick = (pos) => {
        if (editor) {
            editor.chain().focus().setTextSelection(pos).run();
            // Scroll into view logic is handled by Tiptap's focus, 
            // but sometimes we might need to manually scroll the container if it's custom.
            // For now, let's rely on Tiptap's scrollIntoView.
            const dom = editor.view.domAtPos(pos).node;
            if (dom && dom.scrollIntoView) {
                dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    if (!editor) return null;

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden lg:flex sticky top-0">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-600">
                <AlignLeft size={18} />
                <span className="font-medium text-sm">文档大纲</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
                {headings.length === 0 ? (
                    <div className="text-sm text-gray-400 italic text-center mt-10">
                        暂无标题
                        <br />
                        <span className="text-xs">添加标题以在此处显示</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {headings.map((heading, index) => (
                            <button
                                key={index}
                                onClick={() => handleHeadingClick(heading.pos)}
                                className={`text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600 py-1.5 px-2 rounded truncate transition-colors
                                    ${heading.level === 1 ? 'font-medium' : ''}
                                    ${heading.level === 2 ? 'pl-4 text-xs' : ''}
                                    ${heading.level >= 3 ? 'pl-8 text-xs text-gray-500' : ''}
                                `}
                                title={heading.text}
                            >
                                {heading.text || '(无标题)'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
