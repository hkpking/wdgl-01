import React, { useState, useEffect, useRef } from 'react';

export default function Ruler({ editor }) {
    const [leftMargin, setLeftMargin] = useState(0);
    const [textIndent, setTextIndent] = useState(0);
    const rulerRef = useRef(null);
    const isDraggingLeft = useRef(false);
    const isDraggingIndent = useRef(false);

    // Sync with editor state
    useEffect(() => {
        if (!editor) return;

        const updateRuler = () => {
            const { selection } = editor.state;
            const { $from } = selection;

            // Get attributes from the current node
            // This is a simplification; ideally we handle multiple blocks
            const node = $from.parent;
            if (node.type.name === 'paragraph' || node.type.name === 'heading') {
                const ml = parseInt(node.attrs.marginLeft) || 0;
                const ti = parseInt(node.attrs.textIndent) || 0;
                setLeftMargin(ml);
                setTextIndent(ti);
            }
        };

        editor.on('selectionUpdate', updateRuler);
        editor.on('update', updateRuler);
        updateRuler();

        return () => {
            editor.off('selectionUpdate', updateRuler);
            editor.off('update', updateRuler);
        };
    }, [editor]);

    const handleMouseMove = (e) => {
        if (!rulerRef.current) return;
        const rect = rulerRef.current.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;

        // Clamp values
        // 32px is the base padding of the editor (px-8)
        // But the ruler is aligned with the page container.
        // Let's assume the ruler starts at the edge of the page.
        // The content area starts at 32px (approx 3.75% of 816px).
        // For simplicity, we'll map pixels directly relative to the content start.

        // Actually, let's just use pixels relative to the ruler start, 
        // and assume the ruler matches the page width (816px).
        // The editor has 32px padding. So 0 indent means 32px on ruler.

        const BASE_PADDING = 32;
        const rawX = Math.max(0, Math.min(rect.width, relativeX));
        const indentVal = Math.max(0, rawX - BASE_PADDING);

        if (isDraggingLeft.current) {
            setLeftMargin(indentVal);
        } else if (isDraggingIndent.current) {
            // Text indent is relative to margin left in CSS, 
            // but visually we want the triangle to move.
            // In our model, textIndent is the offset from marginLeft.
            // So if mouse is at X, and marginLeft is at M, textIndent is X - M - BASE_PADDING.
            // Wait, simpler: 
            // Marker position = BASE_PADDING + marginLeft + textIndent.
            // So textIndent = rawX - BASE_PADDING - leftMargin.
            setTextIndent(rawX - BASE_PADDING - leftMargin);
        }
    };

    const handleMouseUp = () => {
        if (isDraggingLeft.current) {
            editor?.commands.setMarginLeft(leftMargin);
            isDraggingLeft.current = false;
        }
        if (isDraggingIndent.current) {
            editor?.commands.setTextIndent(textIndent);
            isDraggingIndent.current = false;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const startDragLeft = (e) => {
        e.preventDefault();
        isDraggingLeft.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const startDragIndent = (e) => {
        e.preventDefault();
        isDraggingIndent.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const BASE_PADDING = 32; // px-8
    const leftMarkerPos = BASE_PADDING + leftMargin;
    const indentMarkerPos = BASE_PADDING + leftMargin + textIndent;

    return (
        <div
            className="h-6 bg-[#f8f9fa] border-b border-[#c7c7c7] flex items-end relative select-none"
            ref={rulerRef}
        >
            {/* Ruler Markings Mockup */}
            <div className="w-full h-full relative overflow-hidden pointer-events-none">
                {/* Simple ticks */}
                {Array.from({ length: 81 }).map((_, i) => {
                    const isMajor = i % 10 === 0;
                    return (
                        <div
                            key={i}
                            className={`absolute bottom-0 w-px ${isMajor ? 'bg-gray-400 h-2' : 'bg-gray-300 h-1'}`}
                            style={{
                                left: `${BASE_PADDING + (i * 10)}px`, // 10px per tick approx
                            }}
                        >
                            {isMajor && i > 0 && (
                                <span className="absolute -top-3 left-0.5 text-[8px] text-gray-500">
                                    {i}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Left Margin Indicator (Triangle pointing up) */}
            <div
                className="absolute top-[12px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-blue-500 cursor-ew-resize z-20 hover:scale-110 transition-transform"
                style={{ left: `${leftMarkerPos - 6}px` }}
                onMouseDown={startDragLeft}
                title="左缩进"
            />

            {/* First Line Indent Indicator (Rectangle/Bar) */}
            <div
                className="absolute top-0 w-[4px] h-[10px] bg-blue-500 cursor-ew-resize z-20 hover:scale-110 transition-transform"
                style={{ left: `${indentMarkerPos - 2}px` }}
                onMouseDown={startDragIndent}
                title="首行缩进"
            />

            {/* Right Margin Indicator (Mockup) */}
            <div className="absolute top-0 right-[32px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-blue-500 cursor-ew-resize opacity-50"></div>
        </div>
    );
}
