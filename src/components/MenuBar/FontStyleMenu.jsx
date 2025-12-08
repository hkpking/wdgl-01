/**
 * 字体样式菜单组件
 * 包含字体选择、字号选择功能
 */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

// 字体列表
const FONT_FAMILIES = [
    { name: '默认字体', value: '' },
    { name: 'Arial', value: 'Arial' },
    { name: 'Helvetica', value: 'Helvetica' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Courier New', value: 'Courier New' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Verdana', value: 'Verdana' },
    { name: 'Comic Sans MS', value: 'Comic Sans MS' },
    { name: '宋体', value: 'SimSun' },
    { name: '黑体', value: 'SimHei' },
    { name: '微软雅黑', value: 'Microsoft YaHei' },
    { name: '楷体', value: 'KaiTi' },
];

// 字号列表
const FONT_SIZES = [
    { name: '默认', value: '' },
    { name: '12px', value: '12px' },
    { name: '14px', value: '14px' },
    { name: '16px', value: '16px' },
    { name: '18px', value: '18px' },
    { name: '20px', value: '20px' },
    { name: '24px', value: '24px' },
    { name: '30px', value: '30px' },
    { name: '36px', value: '36px' },
    { name: '48px', value: '48px' },
    { name: '60px', value: '60px' },
    { name: '72px', value: '72px' },
];

// 行高列表
const LINE_HEIGHTS = [
    { name: '默认', value: '' },
    { name: '1', value: '1' },
    { name: '1.15', value: '1.15' },
    { name: '1.5', value: '1.5' },
    { name: '2', value: '2' },
    { name: '2.5', value: '2.5' },
    { name: '3', value: '3' },
];

export function FontStyleMenu({ editor }) {
    const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);

    const fontFamilyMenuRef = useRef(null);
    const fontSizeMenuRef = useRef(null);
    const lineHeightMenuRef = useRef(null);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fontFamilyMenuRef.current && !fontFamilyMenuRef.current.contains(event.target)) {
                setShowFontFamilyMenu(false);
            }
            if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target)) {
                setShowFontSizeMenu(false);
            }
            if (lineHeightMenuRef.current && !lineHeightMenuRef.current.contains(event.target)) {
                setShowLineHeightMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2 relative">
            {/* 字体选择 */}
            <div className="relative" ref={fontFamilyMenuRef}>
                <Button
                    onClick={() => setShowFontFamilyMenu(!showFontFamilyMenu)}
                    title="字体"
                    className="w-24 justify-between flex items-center"
                >
                    <span className="truncate text-xs">
                        {editor.getAttributes('textStyle').fontFamily || '默认字体'}
                    </span>
                    <ChevronDown size={12} />
                </Button>
                {showFontFamilyMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px] max-h-60 overflow-y-auto">
                        {FONT_FAMILIES.map((font) => (
                            <button
                                key={font.name}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (font.value) {
                                        editor.chain().focus().setFontFamily(font.value).run();
                                    } else {
                                        editor.chain().focus().unsetFontFamily().run();
                                    }
                                    setShowFontFamilyMenu(false);
                                }}
                                className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive('textStyle', { fontFamily: font.value }) ? 'bg-gray-100' : ''}`}
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 字号选择 */}
            <div className="relative" ref={fontSizeMenuRef}>
                <Button
                    onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                    title="字号"
                    className="w-16 justify-between flex items-center"
                >
                    <span className="truncate text-xs">
                        {editor.getAttributes('fontSize').size || '默认'}
                    </span>
                    <ChevronDown size={12} />
                </Button>
                {showFontSizeMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px] max-h-60 overflow-y-auto">
                        {FONT_SIZES.map((size) => (
                            <button
                                key={size.name}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (size.value) {
                                        editor.chain().focus().setFontSize(size.value).run();
                                    } else {
                                        editor.chain().focus().unsetFontSize().run();
                                    }
                                    setShowFontSizeMenu(false);
                                }}
                                className={`flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm ${editor.isActive('fontSize', { size: size.value }) ? 'bg-gray-100' : ''}`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 行高选择 */}
            <div className="relative" ref={lineHeightMenuRef}>
                <Button
                    onClick={() => setShowLineHeightMenu(!showLineHeightMenu)}
                    title="行高"
                    className="w-14 justify-between flex items-center"
                >
                    <span className="truncate text-xs">
                        {editor.getAttributes('paragraph').lineHeight || '行高'}
                    </span>
                    <ChevronDown size={12} />
                </Button>
                {showLineHeightMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[60px]">
                        {LINE_HEIGHTS.map((lh) => (
                            <button
                                key={lh.name}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (lh.value) {
                                        editor.chain().focus().setLineHeight(lh.value).run();
                                    } else {
                                        editor.chain().focus().unsetLineHeight().run();
                                    }
                                    setShowLineHeightMenu(false);
                                }}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-left text-sm"
                            >
                                {lh.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
