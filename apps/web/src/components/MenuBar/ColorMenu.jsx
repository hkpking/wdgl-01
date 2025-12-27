/**
 * 颜色选择器菜单组件
 * 包含文字颜色和背景高亮选择
 */
import React, { useState, useRef, useEffect } from 'react';
import { Palette, Highlighter } from 'lucide-react';
import { COLORS, ToolbarButton as Button } from '../shared';

export function ColorMenu({ editor }) {
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);

    const colorMenuRef = useRef(null);
    const highlightMenuRef = useRef(null);
    const colorInputRef = useRef(null);
    const highlightInputRef = useRef(null);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
                setShowColorMenu(false);
            }
            if (highlightMenuRef.current && !highlightMenuRef.current.contains(event.target)) {
                setShowHighlightMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!editor) return null;

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2 relative">
            {/* 文字颜色 */}
            <div className="relative" ref={colorMenuRef}>
                <Button
                    onClick={() => setShowColorMenu(!showColorMenu)}
                    title="文字颜色"
                    isActive={!!editor.getAttributes('textStyle').color}
                >
                    <Palette size={18} />
                    <div
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-gray-300"
                        style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                    />
                </Button>

                {showColorMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                        <div className="mb-2 pb-2 border-b border-gray-100">
                            <button
                                onClick={() => {
                                    editor.chain().focus().unsetColor().run();
                                    setShowColorMenu(false);
                                }}
                                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                                <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-xs">A</div>
                                <span>默认颜色 (黑色)</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-10 gap-1 mb-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        editor.chain().focus().setColor(color).run();
                                        setShowColorMenu(false);
                                    }}
                                    className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    colorInputRef.current?.click();
                                    setShowColorMenu(false);
                                }}
                                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500"></div>
                                <span>自定义颜色...</span>
                            </button>
                        </div>
                    </div>
                )}

                <input
                    ref={colorInputRef}
                    type="color"
                    className="hidden"
                    onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                    value={editor.getAttributes('textStyle').color || '#000000'}
                />
            </div>

            {/* 背景高亮 */}
            <div className="relative" ref={highlightMenuRef}>
                <Button
                    onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                    title="背景高亮"
                    isActive={editor.isActive('highlight')}
                >
                    <Highlighter size={18} />
                    <div
                        className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-gray-300"
                        style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent' }}
                    />
                </Button>

                {showHighlightMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                        <div className="mb-2 pb-2 border-b border-gray-100">
                            <button
                                onClick={() => {
                                    editor.chain().focus().unsetHighlight().run();
                                    setShowHighlightMenu(false);
                                }}
                                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                                <div className="w-4 h-4 rounded border border-gray-300 bg-white text-gray-400 flex items-center justify-center text-xs">/</div>
                                <span>无背景色</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-10 gap-1 mb-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        editor.chain().focus().toggleHighlight({ color }).run();
                                        setShowHighlightMenu(false);
                                    }}
                                    className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <button
                                onClick={() => {
                                    highlightInputRef.current?.click();
                                    setShowHighlightMenu(false);
                                }}
                                className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                            >
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-200 via-pink-200 to-blue-200"></div>
                                <span>自定义颜色...</span>
                            </button>
                        </div>
                    </div>
                )}

                <input
                    ref={highlightInputRef}
                    type="color"
                    className="hidden"
                    onInput={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
                    value={editor.getAttributes('highlight').color || '#FFFF00'}
                />
            </div>
        </div>
    );
}
