"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { COLORS, ToolbarButton, ToolbarSeparator } from '@/components/shared';

interface FormatDropdownsProps {
    editor: any;
}

/**
 * 标题和字体选择下拉菜单组
 */
export function HeadingDropdown({ editor }: { editor: any }) {
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

    const getCurrentHeading = () => {
        if (editor.isActive('heading', { level: 1 })) return '标题 1';
        if (editor.isActive('heading', { level: 2 })) return '标题 2';
        if (editor.isActive('heading', { level: 3 })) return '标题 3';
        return '普通文本';
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f0f4f8] text-[#444746] text-sm font-medium w-32 justify-between"
            >
                <span className="truncate">{getCurrentHeading()}</span>
                <ChevronDown size={12} />
            </button>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px]">
                    <button onClick={() => { editor.chain().focus().setParagraph().run(); setShowMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm">普通文本</button>
                    <button onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setShowMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-xl font-bold">标题 1</button>
                    <button onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-lg font-bold">标题 2</button>
                    <button onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setShowMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-base font-bold">标题 3</button>
                </div>
            )}
        </div>
    );
}

/**
 * 字体选择下拉菜单
 */
export function FontFamilyDropdown({ editor }: { editor: any }) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const fonts = [
        { name: 'Arial', value: 'Arial' },
        { name: 'Times New Roman', value: 'Times New Roman' },
        { name: 'Courier New', value: 'Courier New' },
        { name: 'Georgia', value: 'Georgia' },
        { name: 'Verdana', value: 'Verdana' },
        { name: '宋体', value: 'SimSun' },
        { name: '黑体', value: 'SimHei' },
        { name: '微软雅黑', value: 'Microsoft YaHei' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f0f4f8] text-[#444746] text-sm font-medium w-28 justify-between"
            >
                <span className="truncate">{editor.getAttributes('textStyle').fontFamily || 'Arial'}</span>
                <ChevronDown size={12} />
            </button>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px] max-h-60 overflow-y-auto">
                    {fonts.map((font) => (
                        <button
                            key={font.name}
                            onClick={() => { editor.chain().focus().setFontFamily(font.value).run(); setShowMenu(false); }}
                            className="text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            style={{ fontFamily: font.value }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * 字号控制
 */
export function FontSizeControl({ editor }: { editor: any }) {
    const currentSize = parseInt(editor.getAttributes('textStyle').fontSize) || 11;

    const decrease = () => {
        editor.chain().focus().setFontSize(`${Math.max(8, currentSize - 1)}px`).run();
    };

    const increase = () => {
        editor.chain().focus().setFontSize(`${currentSize + 1}px`).run();
    };

    return (
        <div className="flex items-center">
            <ToolbarButton onClick={decrease} title="减小字号">
                <span className="text-xs">−</span>
            </ToolbarButton>
            <div className="w-8 text-center text-sm border border-gray-300 rounded mx-1 bg-white h-[24px] leading-[22px]">
                {currentSize}
            </div>
            <ToolbarButton onClick={increase} title="增大字号">
                <span className="text-xs">+</span>
            </ToolbarButton>
        </div>
    );
}

/**
 * 行间距选择
 */
export function LineHeightDropdown({ editor }: { editor: any }) {
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

    return (
        <div className="relative" ref={menuRef}>
            <ToolbarButton onClick={() => setShowMenu(!showMenu)} title="行间距">
                <span className="text-xs font-medium">行距</span>
            </ToolbarButton>
            {showMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px]">
                    {['1.0', '1.15', '1.5', '2.0'].map((lh) => (
                        <button
                            key={lh}
                            onClick={() => { editor.chain().focus().setLineHeight(lh).run(); setShowMenu(false); }}
                            className="text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                            {lh}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
