"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Highlighter } from 'lucide-react';
import { COLORS, ToolbarButton } from '@/components/shared';

interface ColorPickerProps {
    editor: any;
}

/**
 * 文字颜色选择器
 */
export function TextColorPicker({ editor }: ColorPickerProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentColor = editor.getAttributes('textStyle').color || '#000000';

    return (
        <div className="relative" ref={menuRef}>
            <ToolbarButton
                onClick={() => setShowMenu(!showMenu)}
                title="文字颜色"
                className="flex flex-col items-center justify-center gap-0"
            >
                <span className="font-bold text-sm leading-none" style={{ color: currentColor }}>A</span>
                <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: currentColor }}></div>
            </ToolbarButton>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                    <div className="grid grid-cols-10 gap-1 mb-2">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => { editor.chain().focus().setColor(color).run(); setShowMenu(false); }}
                                className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <input
                        type="color"
                        className="w-full h-8 cursor-pointer"
                        onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * 高亮颜色选择器
 */
export function HighlightColorPicker({ editor }: ColorPickerProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentColor = editor.getAttributes('highlight').color || 'transparent';

    return (
        <div className="relative" ref={menuRef}>
            <ToolbarButton
                onClick={() => setShowMenu(!showMenu)}
                title="高亮颜色"
                className="flex flex-col items-center justify-center gap-0"
            >
                <Highlighter size={14} />
                <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: currentColor }}></div>
            </ToolbarButton>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                    <button
                        onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowMenu(false); }}
                        className="w-full text-left mb-2 text-sm hover:bg-gray-100 p-1 rounded"
                    >
                        无颜色
                    </button>
                    <div className="grid grid-cols-10 gap-1 mb-2">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => { editor.chain().focus().toggleHighlight({ color }).run(); setShowMenu(false); }}
                                className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
