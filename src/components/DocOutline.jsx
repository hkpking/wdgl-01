import React, { useState, useEffect } from 'react';
import { AlignLeft, ChevronRight } from 'lucide-react';

export default function DocOutline({ editor }) {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        if (!editor) return;

        const updateHeadings = () => {
            const newHeadings = [];
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                    // Use a more stable ID if possible, but pos is okay for static content
                    // Ideally, we should add IDs to heading nodes in Tiptap
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
            // Find the heading that is closest to the top of the viewport
            // We can use editor.view.domAtPos to get DOM elements
            let currentActiveId = null;
            let minDistance = Infinity;

            // Get the editor scroll container (usually the parent with overflow-y-auto)
            // In our case, it's the parent div in Editor.jsx
            // But we can also check relative to viewport

            for (const heading of headings) {
                try {
                    const dom = editor.view.nodeDOM(heading.pos);
                    // nodeDOM might return the content, not the wrapper. 
                    // Use domAtPos for more reliability in some cases, but nodeDOM is usually fine for blocks.
                    // Actually, editor.view.nodeDOM(pos) returns the DOM node for the node at pos.

                    if (dom && dom.getBoundingClientRect) {
                        const rect = dom.getBoundingClientRect();
                        // We want the heading that is just above or close to the top (e.g. within top 200px)
                        // Or the first one visible.

                        // Distance from top of viewport
                        const distance = Math.abs(rect.top - 100); // Offset for header

                        if (distance < minDistance) {
                            minDistance = distance;
                            currentActiveId = heading.id;
                        }
                    }
                } catch (e) {
                    // Ignore errors if DOM not found
                }
            }

            if (currentActiveId) {
                setActiveId(currentActiveId);
            }
        };

        // Attach scroll listener to the scrollable container
        // We need to find the scrollable container. In Editor.jsx, it's the div with overflow-y-auto.
        // We can attach to window if it scrolls window, but here it scrolls a div.
        // A simple way is to attach to 'scroll' on capture phase on document, or find the specific element.
        // Let's try attaching to the editor's parent element if possible, or just use a global capture.

        const scrollContainer = editor.view.dom.closest('.overflow-y-auto');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
            // Initial check
            handleScroll();
        } else {
            // Fallback
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
            // editor.chain().focus().setTextSelection(pos).run();
            // Better scrolling:
            const dom = editor.view.nodeDOM(pos);
            if (dom && dom.scrollIntoView) {
                dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Update active manually for instant feedback
            setActiveId(`heading-${pos}`);
        }
    };

    if (!editor) return null;

    return (
        <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col hidden lg:flex sticky top-0">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 text-gray-600">
                <AlignLeft size={18} />
                <span className="font-medium text-sm">文档大纲</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                {headings.length === 0 ? (
                    <div className="text-sm text-gray-400 italic text-center mt-10">
                        暂无标题
                        <br />
                        <span className="text-xs">添加标题以在此处显示</span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-0.5">
                        {headings.map((heading, index) => (
                            <button
                                key={index}
                                onClick={() => handleHeadingClick(heading.pos)}
                                className={`text-left text-sm py-1.5 px-2 rounded truncate transition-all duration-200
                                    ${activeId === heading.id
                                        ? 'bg-blue-50 text-blue-600 font-medium border-l-2 border-blue-500'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900 border-l-2 border-transparent'}
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
