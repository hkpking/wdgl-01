import React, { useState, useEffect } from 'react';
import {
    Bold, Italic, Underline, Strikethrough, Code, List, ListOrdered, CheckSquare,
    Quote, SquareCode, MessageSquarePlus, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    Type, ChevronDown, Heading1, Heading2, Heading3, Minus,
    Table as TableIcon, Plus, MoreHorizontal,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Highlighter, Palette, Baseline, Printer, PaintRoller, SpellCheck,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, Merge, Split, X
} from 'lucide-react';
import { COLORS, ToolbarButton, ToolbarSeparator } from './shared';
import { useImageUpload } from '../hooks/useImageUpload';

// COLORS 已移至 shared/colors.js

export default function DocToolbar({ editor, onAddComment }) {
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [showFontFamilyMenu, setShowFontFamilyMenu] = useState(false);
    const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
    const [showLineHeightMenu, setShowLineHeightMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    // Insert Menu State
    const [showInsertMenu, setShowInsertMenu] = useState(false);
    const [showTablePicker, setShowTablePicker] = useState(false);
    const [tableSize, setTableSize] = useState({ rows: 0, cols: 0 });

    // 使用共享的图片上传 Hook
    const { fileInputRef, handleImageUpload, triggerUpload } = useImageUpload(editor);

    const insertMenuRef = React.useRef(null);
    const headingMenuRef = React.useRef(null);
    const fontFamilyMenuRef = React.useRef(null);
    const fontSizeMenuRef = React.useRef(null);
    const lineHeightMenuRef = React.useRef(null);
    const colorMenuRef = React.useRef(null);
    const highlightMenuRef = React.useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (insertMenuRef.current && !insertMenuRef.current.contains(event.target)) {
                setShowInsertMenu(false);
                setShowTablePicker(false);
            }
            if (headingMenuRef.current && !headingMenuRef.current.contains(event.target)) {
                setShowHeadingMenu(false);
            }
            if (fontFamilyMenuRef.current && !fontFamilyMenuRef.current.contains(event.target)) {
                setShowFontFamilyMenu(false);
            }
            if (fontSizeMenuRef.current && !fontSizeMenuRef.current.contains(event.target)) {
                setShowFontSizeMenu(false);
            }
            if (lineHeightMenuRef.current && !lineHeightMenuRef.current.contains(event.target)) {
                setShowLineHeightMenu(false);
            }
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

    if (!editor) {
        return null;
    }

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    // ToolbarButton 和 ToolbarSeparator 已从 shared/ 导入，使用 google-docs variant

    const isTableActive = editor.isActive('table');

    return (
        <div className="bg-[#edf2fa] px-3 py-1.5 flex flex-wrap gap-0.5 items-center border-b border-[#c7c7c7] sticky top-0 z-10 w-full">
            {/* History */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="撤销 (Ctrl+Z)"
            >
                <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="重做 (Ctrl+Y)"
            >
                <Redo size={16} />
            </ToolbarButton>
            <ToolbarButton title="打印 (Ctrl+P)" onClick={() => window.print()}>
                <Printer size={16} />
            </ToolbarButton>
            <ToolbarButton title="拼写检查">
                <SpellCheck size={16} />
            </ToolbarButton>
            <ToolbarButton title="格式刷">
                <PaintRoller size={16} />
            </ToolbarButton>

            <div className="flex items-center gap-1 ml-2 mr-1">
                <span className="text-sm text-[#444746] font-medium cursor-pointer hover:bg-[#f0f4f8] px-2 py-1 rounded">100%</span>
                <ChevronDown size={12} className="text-[#444746]" />
            </div>

            <ToolbarSeparator />

            {/* Headings / Normal Text */}
            <div className="relative" ref={headingMenuRef}>
                <button
                    onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f0f4f8] text-[#444746] text-sm font-medium w-32 justify-between"
                >
                    <span className="truncate">
                        {editor.isActive('heading', { level: 1 }) ? '标题 1' :
                            editor.isActive('heading', { level: 2 }) ? '标题 2' :
                                editor.isActive('heading', { level: 3 }) ? '标题 3' :
                                    '普通文本'}
                    </span>
                    <ChevronDown size={12} />
                </button>
                {showHeadingMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px]">
                        <button onClick={() => { editor.chain().focus().setParagraph().run(); setShowHeadingMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm">普通文本</button>
                        <button onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setShowHeadingMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-xl font-bold">标题 1</button>
                        <button onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowHeadingMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-lg font-bold">标题 2</button>
                        <button onClick={() => { editor.chain().focus().toggleHeading({ level: 3 }).run(); setShowHeadingMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-base font-bold">标题 3</button>
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            {/* Font Family */}
            <div className="relative" ref={fontFamilyMenuRef}>
                <button
                    onClick={() => setShowFontFamilyMenu(!showFontFamilyMenu)}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f0f4f8] text-[#444746] text-sm font-medium w-28 justify-between"
                >
                    <span className="truncate">
                        {editor.getAttributes('textStyle').fontFamily || 'Arial'}
                    </span>
                    <ChevronDown size={12} />
                </button>
                {showFontFamilyMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[150px] max-h-60 overflow-y-auto">
                        {[
                            { name: 'Arial', value: 'Arial' },
                            { name: 'Times New Roman', value: 'Times New Roman' },
                            { name: 'Courier New', value: 'Courier New' },
                            { name: 'Georgia', value: 'Georgia' },
                            { name: 'Verdana', value: 'Verdana' },
                            { name: '宋体', value: 'SimSun' },
                            { name: '黑体', value: 'SimHei' },
                            { name: '微软雅黑', value: 'Microsoft YaHei' },
                        ].map((font) => (
                            <button
                                key={font.name}
                                onClick={() => {
                                    editor.chain().focus().setFontFamily(font.value).run();
                                    setShowFontFamilyMenu(false);
                                }}
                                className="text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                style={{ fontFamily: font.value }}
                            >
                                {font.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            {/* Font Size */}
            <div className="flex items-center">
                <ToolbarButton onClick={() => {
                    // Simplified decrease logic
                    const current = parseInt(editor.getAttributes('textStyle').fontSize) || 16;
                    editor.chain().focus().setFontSize(`${Math.max(8, current - 1)}px`).run();
                }}>
                    <Minus size={12} />
                </ToolbarButton>
                <div className="w-8 text-center text-sm border border-gray-300 rounded mx-1 bg-white h-[24px] leading-[22px]">
                    {parseInt(editor.getAttributes('textStyle').fontSize) || 11}
                </div>
                <ToolbarButton onClick={() => {
                    // Simplified increase logic
                    const current = parseInt(editor.getAttributes('textStyle').fontSize) || 16;
                    editor.chain().focus().setFontSize(`${current + 1}px`).run();
                }}>
                    <Plus size={12} />
                </ToolbarButton>
            </div>

            <ToolbarSeparator />

            {/* Basic Formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="粗体 (Ctrl+B)"
            >
                <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="斜体 (Ctrl+I)"
            >
                <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="删除线"
            >
                <Strikethrough size={16} />
            </ToolbarButton>
            <div className="relative" ref={colorMenuRef}>
                <ToolbarButton
                    onClick={() => setShowColorMenu(!showColorMenu)}
                    title="文字颜色"
                    className="flex flex-col items-center justify-center gap-0"
                >
                    <span className="font-bold text-sm leading-none" style={{ color: editor.getAttributes('textStyle').color || '#000000' }}>A</span>
                    <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}></div>
                </ToolbarButton>
                {showColorMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                        <div className="grid grid-cols-10 gap-1 mb-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        editor.chain().focus().setColor(color).run();
                                        setShowColorMenu(false);
                                    }}
                                    className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            className="w-full h-8 cursor-pointer"
                            onInput={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        />
                    </div>
                )}
            </div>

            <div className="relative" ref={highlightMenuRef}>
                <ToolbarButton
                    onClick={() => setShowHighlightMenu(!showHighlightMenu)}
                    title="高亮颜色"
                    className="flex flex-col items-center justify-center gap-0"
                >
                    <Highlighter size={14} />
                    <div className="w-4 h-1 mt-0.5" style={{ backgroundColor: editor.getAttributes('highlight').color || 'transparent' }}></div>
                </ToolbarButton>
                {showHighlightMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
                        <button onClick={() => { editor.chain().focus().unsetHighlight().run(); setShowHighlightMenu(false); }} className="w-full text-left mb-2 text-sm hover:bg-gray-100 p-1 rounded">无颜色</button>
                        <div className="grid grid-cols-10 gap-1 mb-2">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        editor.chain().focus().toggleHighlight({ color }).run();
                                        setShowHighlightMenu(false);
                                    }}
                                    className="w-5 h-5 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            {/* Link & Image */}
            <ToolbarButton
                onClick={() => setShowLinkInput(!showLinkInput)}
                isActive={editor.isActive('link')}
                title="插入链接 (Ctrl+K)"
            >
                <LinkIcon size={16} />
            </ToolbarButton>
            {showLinkInput && (
                <div className="absolute top-full left-1/2 mt-1 bg-white border border-gray-200 rounded shadow-lg p-2 flex gap-2 z-50 w-64 transform -translate-x-1/2">
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="输入链接..."
                        className="border border-gray-300 rounded px-2 py-1 text-sm flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleSetLink()}
                        autoFocus
                    />
                    <button onClick={handleSetLink} className="bg-blue-500 text-white px-2 py-1 rounded text-sm">确定</button>
                </div>
            )}

            <ToolbarButton
                onClick={onAddComment}
                title="添加评论"
            >
                <MessageSquarePlus size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Insert Menu */}
            <div className="relative" ref={insertMenuRef}>
                <button
                    onClick={() => setShowInsertMenu(!showInsertMenu)}
                    className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#f0f4f8] text-[#444746] text-sm font-medium"
                >
                    <Plus size={16} />
                    <span>插入</span>
                    <ChevronDown size={12} />
                </button>
                {showInsertMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[180px]">
                        <button onClick={() => { triggerUpload(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <ImageIcon size={14} /> 图片
                        </button>
                        <button onClick={() => { setShowTablePicker(!showTablePicker); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 justify-between group relative">
                            <span className="flex items-center gap-2"><TableIcon size={14} /> 表格</span>
                            <ChevronDown size={12} className="-rotate-90" />

                            {/* Table Picker Submenu */}
                            {showTablePicker && (
                                <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded shadow-lg p-2 z-30 w-48">
                                    <div className="mb-2 text-xs text-gray-500 text-center">
                                        {tableSize.rows > 0 ? `${tableSize.cols} x ${tableSize.rows}` : '插入表格'}
                                    </div>
                                    <div
                                        className="grid grid-cols-10 gap-1"
                                        onMouseLeave={() => setTableSize({ rows: 0, cols: 0 })}
                                    >
                                        {[...Array(10)].map((_, row) => (
                                            [...Array(10)].map((_, col) => (
                                                <div
                                                    key={`${row}-${col}`}
                                                    className={`w-3 h-3 border border-gray-200 ${col < tableSize.cols && row < tableSize.rows
                                                        ? 'bg-blue-500 border-blue-600'
                                                        : 'bg-white hover:bg-blue-100'
                                                        }`}
                                                    onMouseEnter={() => setTableSize({ rows: row + 1, cols: col + 1 })}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editor.chain().focus().insertTable({ rows: row + 1, cols: col + 1, withHeaderRow: true }).run();
                                                        setShowTablePicker(false);
                                                        setShowInsertMenu(false);
                                                    }}
                                                />
                                            ))
                                        ))}
                                    </div>
                                </div>
                            )}
                        </button>

                        <div className="h-[1px] bg-gray-200 my-1"></div>

                        <button onClick={() => { editor.chain().focus().insertContent({ type: 'risk' }).run(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <span className="text-red-500"><ArrowUp size={14} /></span> 风险点
                        </button>
                        <button onClick={() => { editor.chain().focus().insertContent({ type: 'rule' }).run(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <span className="text-blue-500"><CheckSquare size={14} /></span> 控制规则
                        </button>
                        <button onClick={() => { editor.chain().focus().insertContent({ type: 'processLink' }).run(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <span className="text-purple-500"><LinkIcon size={14} /></span> 关联流程
                        </button>
                        <button onClick={() => { editor.chain().focus().insertContent({ type: 'processCard' }).run(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <span className="text-slate-500"><SquareCode size={14} /></span> 流程卡片
                        </button>
                        <button onClick={() => { editor.chain().focus().insertContent({ type: 'architectureMatrix' }).run(); setShowInsertMenu(false); }} className="text-left px-3 py-2 hover:bg-gray-100 text-sm flex items-center gap-2">
                            <span className="text-slate-500"><List size={14} /></span> 架构矩阵
                        </button>
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            {/* Alignment */}
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                isActive={editor.isActive({ textAlign: 'left' })}
                title="左对齐"
            >
                <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                isActive={editor.isActive({ textAlign: 'center' })}
                title="居中对齐"
            >
                <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                isActive={editor.isActive({ textAlign: 'right' })}
                title="右对齐"
            >
                <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                isActive={editor.isActive({ textAlign: 'justify' })}
                title="两端对齐"
            >
                <AlignJustify size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Line Height */}
            <div className="relative" ref={lineHeightMenuRef}>
                <ToolbarButton
                    onClick={() => setShowLineHeightMenu(!showLineHeightMenu)}
                    title="行间距"
                >
                    <Baseline size={16} />
                </ToolbarButton>
                {showLineHeightMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg p-1 flex flex-col gap-1 z-20 min-w-[80px]">
                        {['1.0', '1.15', '1.5', '2.0'].map((lh) => (
                            <button
                                key={lh}
                                onClick={() => {
                                    editor.chain().focus().setLineHeight(lh).run();
                                    setShowLineHeightMenu(false);
                                }}
                                className="text-left px-3 py-2 hover:bg-gray-100 text-sm"
                            >
                                {lh}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ToolbarSeparator />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="无序列表"
            >
                <List size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="有序列表"
            >
                <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleTaskList().run()}
                isActive={editor.isActive('taskList')}
                title="任务列表"
            >
                <CheckSquare size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Indent */}
            <ToolbarButton title="减少缩进">
                <Minus size={16} />
            </ToolbarButton>
            <ToolbarButton title="增加缩进">
                <Plus size={16} />
            </ToolbarButton>

            <ToolbarSeparator />

            {/* Clear Format */}
            <ToolbarButton
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                title="清除格式"
            >
                <span className="font-bold text-xs italic line-through">Tx</span>
            </ToolbarButton>

            {/* Table Tools (Dynamic) */}
            {isTableActive && (
                <>
                    <ToolbarSeparator />
                    <div className="flex items-center gap-0.5 bg-blue-50 rounded px-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                            title="上方插入行"
                        >
                            <ArrowUp size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            title="下方插入行"
                        >
                            <ArrowDown size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                            title="左侧插入列"
                        >
                            <ArrowLeft size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            title="右侧插入列"
                        >
                            <ArrowRight size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().mergeCells().run()}
                            title="合并单元格"
                        >
                            <Merge size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().splitCell().run()}
                            title="拆分单元格"
                        >
                            <Split size={14} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            title="删除表格"
                            className="text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={14} />
                        </ToolbarButton>
                    </div>
                </>
            )}

        </div>
    );
}
